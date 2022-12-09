export class Node {
  data: any;
  priority: number = 0;
  next?: Node;

  constructor(data: any, priority: number) {
    this.data = data;
    this.priority = priority;
  }
}

export class PriorityQueue {
  head?: Node;

  push(data: any, priority: number) {
    // Create new Node
    let temp = new Node(data, priority);

    if (!this.head) {
      this.head = temp;
    } else if (this.head.priority > priority) {

      // Insert New Node before head
      temp.next = this.head;
      this.head = temp;
    } else {
      let start = this.head;
      // Traverse the list and find a
      // position to insert new node
      while (start.next != null && start.next.priority < priority) {
        start = start.next;
      }

      // Either at the ends of the list
      // or at required position
      temp.next = start.next;
      start.next = temp;
    }
    return this.head;
  }

  pop() {
    let temp = this.head;
    this.head = this.head?.next;
    return temp;
  }

  peek() {
    return this.head?.data
  }

  isEmpty() {
    return !this.head;
  }
}