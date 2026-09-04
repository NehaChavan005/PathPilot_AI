from collections import deque

import networkx as nx

from backend.app.knowledge_graph.ontology import PREREQUISITE_EDGES


class SkillGraph:
    def __init__(self) -> None:
        self.graph = nx.DiGraph()

    @classmethod
    def from_prerequisite_edges(cls) -> "SkillGraph":
        """Create a SkillGraph pre-populated with all ontology prerequisite edges."""
        g = cls()
        for prerequisite, skill in PREREQUISITE_EDGES:
            g.add_prerequisite(skill, prerequisite)
        return g

    def add_prerequisite(self, skill: str, prerequisite: str) -> None:
        self.graph.add_edge(prerequisite, skill)

    def prerequisites_for(self, skill: str) -> list[str]:
        return list(nx.ancestors(self.graph, skill)) if skill in self.graph else []

    def subsequent_skills_for(self, skill: str) -> list[str]:
        """Return all skills that depend on the given skill (direct and transitive dependents)."""
        if skill not in self.graph:
            return []
        return list(nx.descendants(self.graph, skill))

    def topological_sort_skills(self, skills: list[str]) -> list[str]:
        """Topologically sort the given skills based on prerequisite dependencies.

        Returns skills in dependency order: prerequisites come before dependents.
        Skills not present in the graph are appended at the end.
        """
        if not skills:
            return []

        skill_set = set(skills)
        relevant_nodes = set()

        for s in skills:
            if s in self.graph:
                relevant_nodes.add(s)
                relevant_nodes.update(nx.ancestors(self.graph, s) & skill_set)
                relevant_nodes.update(nx.descendants(self.graph, s) & skill_set)

        if not relevant_nodes:
            return list(skills)

        subgraph = self.graph.subgraph(relevant_nodes)
        topo_order = list(nx.topological_sort(subgraph))

        ordered = [s for s in topo_order if s in skill_set]
        remaining = [s for s in skills if s not in skill_set and s not in ordered]

        return ordered + remaining

    def get_skill_depth(self, skill: str) -> int:
        """Return the longest path length from any root node to this skill (0-indexed depth)."""
        if skill not in self.graph:
            return 0

        ancestors = nx.ancestors(self.graph, skill)
        if not ancestors:
            return 0

        subgraph = self.graph.subgraph(ancestors | {skill})
        lengths = nx.single_target_shortest_path_length(subgraph, skill)
        return max(lengths.values()) if lengths else 0

    def find_missing_prerequisites(
        self,
        target_skills: list[str],
        current_skills: list[str],
    ) -> list[str]:
        """Find prerequisite skills that are missing from the learner's current skills.

        For each target skill, checks if any of its prerequisites (transitive)
        are not in the current skills list.
        """
        current_lower = {s.lower() for s in current_skills}
        missing: list[str] = []

        for skill in target_skills:
            for prereq in self.prerequisites_for(skill):
                if prereq.lower() not in current_lower and prereq not in missing:
                    missing.append(prereq)

        return missing
