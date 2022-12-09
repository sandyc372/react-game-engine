export interface ICanvasNode {
  nodeName: string;
  attributes: {
		[key: string]: any;
	};
  parentNode?: ICanvasNode | null | undefined;
  children: ICanvasNode[]
}

export const createNode = (nodeName: string): ICanvasNode => {
	const node: ICanvasNode = {
		nodeName,
		attributes: {},
		children: [],
		parentNode: null,
	};

	return node;
};

export const appendChildNode = (
	node: ICanvasNode,
	childNode: ICanvasNode
): void => {
	if (childNode.parentNode) {
		removeChildNode(childNode.parentNode, childNode);
	}

	childNode.parentNode = node;
	node.children.push(childNode);
};

export const insertBeforeNode = (
	node: ICanvasNode,
	newChildNode: ICanvasNode,
	beforeChildNode: ICanvasNode
): void => {
	if (newChildNode.parentNode) {
		removeChildNode(newChildNode.parentNode, newChildNode);
	}

	newChildNode.parentNode = node;

	const index = node.children.indexOf(beforeChildNode);
	if (index >= 0) {
		node.children.splice(index, 0, newChildNode);
		return;
	}
	node.children.push(newChildNode);
};

export const removeChildNode = (
	node: ICanvasNode,
	removeNode: ICanvasNode
): void => {

	removeNode.parentNode = null;

	const index = node.children.indexOf(removeNode);
	if (index >= 0) {
		node.children.splice(index, 1);
	}
};

export const setAttribute = (
	node: ICanvasNode,
	key: string,
	value: any
): void => {
	node.attributes[key] = value;
};