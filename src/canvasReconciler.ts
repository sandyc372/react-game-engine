import ReactReconciler from 'react-reconciler';
import {
  createNode,
  appendChildNode,
  insertBeforeNode,
  removeChildNode,
  setAttribute
} from './canvasDom';

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  prepareForCommit: () => { return null },
  resetAfterCommit: () => {},
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: () => false,
  resetTextContent(instance: any) {
    setAttribute(instance, 'text', '');
  },
  createInstance: (type: any, newProps: { [x: string]: any; }, rootContainerInstance: any, _currentHostContext: any, workInProgress: any) => {
    let newElement: any = createNode(type);
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          setAttribute(newElement, 'text', propValue);
        }
      } else {
        setAttribute(newElement, propName, propValue);
      }
    });
    return newElement
  },
  createTextInstance: (text: string) => {
    return createNode('canvastext');
  },
  appendInitialChild: appendChildNode,
  appendChild: appendChildNode,
  insertBefore: insertBeforeNode,
  insertInContainerBefore: insertBeforeNode,
  finalizeInitialChildren: (domElement: any, type: any, props: any) => {},
  supportsMutation: true,
  appendChildToContainer: appendChildNode,
  prepareUpdate(domElement: any, oldProps: any, newProps: any) {
    return true;
  },
  commitUpdate(element: any, updatePayload: any, type: any, oldProps: any, newProps: { [x: string]: any; }) {
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          setAttribute(element, 'text', propValue);
        }
      } else {
        setAttribute(element, propName, propValue);
      }
    });
  },
  commitTextUpdate(textInstance: any, oldText: any, newText: any) {
    setAttribute(textInstance, 'text', newText);
  },
  removeChild: removeChildNode,
  removeChildFromContainer: removeChildNode,
  clearContainer(container: any) {
    (container as any).children = [];
  },
  getPublicInstance(instance: any) {
    return instance
  }
};
const ReactReconcilerInst = ReactReconciler(hostConfig as any);

export const CanvasRenderer = {
  render: (reactElement: any, canvasNode: any, callback: (() => void) | null = () => {}) => {
    // Create a root Container if it doesnt exist
    if (!canvasNode._rootContainer) {
      canvasNode._rootContainer = (ReactReconcilerInst).createContainer(canvasNode, 0, false, null);
    }

    // update the root Container
    return ReactReconcilerInst.updateContainer(reactElement, canvasNode._rootContainer, null, callback as any);
  }
};