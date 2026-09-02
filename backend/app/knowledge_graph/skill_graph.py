import networkx as nx


class SkillGraph:
    def __init__(self) -> None:
        self.graph = nx.DiGraph()

    def add_prerequisite(self, skill: str, prerequisite: str) -> None:
        self.graph.add_edge(prerequisite, skill)

    def prerequisites_for(self, skill: str) -> list[str]:
        return list(nx.ancestors(self.graph, skill)) if skill in self.graph else []
