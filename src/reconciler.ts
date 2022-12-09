import ReactReconciler from 'react-reconciler';
import paper from 'paper';

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: (type: any, props: { children: any; }) => {
    return typeof props.children === 'string' || typeof props.children === 'number';
  },
  resetTextContent(instance: any) {
    (instance as any).content = ''
  },
  /**
   This is where react-reconciler wants to create an instance of UI element in terms of the target. Since our target here is the DOM, we will create document.createElement and type is the argument that contains the type string like div or img or h1 etc. The initial values of domElement attributes can be set in this function from the newProps argument
   */
  createInstance: (type: any, newProps: { [x: string]: any; }, rootContainerInstance: any, _currentHostContext: any, workInProgress: any) => {
    let newElement: any;
    if (type === 'paperlayer') {
      newElement = new paper.Layer();
    } else if (type === 'papertext') {
      newElement = new paper.PointText(new paper.Point(0, 0));
    }
    newElement.remove();
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          newElement.text = propValue;
        }
      } else {
        const propValue = newProps[propName];
        newElement[propName] = propValue;
      }
    });
    return newElement
  },
  createTextInstance: (text: string) => {
    let i = new paper.PointText(new paper.Point(0, 0));
    i.remove();
    return i;
  },
  appendInitialChild: (parent: any, child: any) => {
    parent.activate?.(); // if parent is a layer
    parent.addChild(child);
  },
  appendChild(parent: any, child: any) {
    parent.activate?.(); // if parent is a layer
    parent.addChild(child);
  },
  finalizeInitialChildren: (domElement: any, type: any, props: any) => {},
  supportsMutation: true,
  appendChildToContainer: (parent: any, child: any) => {
    paper.project.addLayer(child);
    console.log(child);
  },
  prepareUpdate(domElement: any, oldProps: any, newProps: any) {
    return true;
  },
  commitUpdate(element: any, updatePayload: any, type: any, oldProps: any, newProps: { [x: string]: any; }) {
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          element.text = propValue;
        }
      } else {
        const propValue = newProps[propName];
        element[propName] = propValue;
      }
    });
  },
  commitTextUpdate(textInstance: any, oldText: any, newText: any) {
    textInstance.text = newText;
  },
  removeChild(parentInstance: any, child: any) {
    parentInstance.removeChild(child);
  },
  clearContainer(container: any) {
    (container as any).innerHTML = '';
  },
  getPublicInstance(instance: any) {
    return instance
  }
};
const ReactReconcilerInst = ReactReconciler(hostConfig as any);

export const CanvasRenderer = {
  render: (reactElement: any, domElement: any, callback: (() => void) | null = () => {}) => {
    // Create a root Container if it doesnt exist
    if (!domElement._rootContainer) {
      domElement._rootContainer = (ReactReconcilerInst).createContainer(domElement, 0, false, null);
    }

    // update the root Container
    return ReactReconcilerInst.updateContainer(reactElement, domElement._rootContainer, null, callback as any);
  }
};