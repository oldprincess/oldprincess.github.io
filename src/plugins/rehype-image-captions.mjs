import { visit } from "unist-util-visit";

/** Add captions to standalone Markdown images, keeping image nodes intact. */
export function rehypeImageCaptions() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "p") return;

			const children = node.children.filter(
				(child) => child.type !== "text" || child.value.trim() !== "",
			);
			if (children.length !== 1) return;
			const image = children[0];
			if (image.type !== "element" || image.tagName !== "img") return;

			const title = image.properties.title;
			const alt = image.properties.alt;
			const caption =
				(typeof title === "string" && title.trim()) ||
				(typeof alt === "string" && alt.trim());
			if (!caption) return;

			node.tagName = "figure";
			node.properties.className = [
				...(node.properties.className || []),
				"image-with-caption",
			];
			node.children = [
				image,
				{
					type: "element",
					tagName: "figcaption",
					properties: {},
					children: [{ type: "text", value: caption }],
				},
			];
		});
	};
}
