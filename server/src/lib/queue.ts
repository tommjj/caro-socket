class Queue<T> {
    data: T[];

    constructor() {
        this.data = [];
    }

    offer(item: T) {
        this.data.push(item);
    }

    remove(index: number): T | undefined;
    remove(
        callback: (value: T, index: number, array: T[]) => boolean
    ): T | undefined;
    remove(
        a: number | ((value: T, index: number, array: T[]) => boolean)
    ): T | undefined {
        const index = typeof a === 'number' ? a : this.data.findIndex(a);

        if (index < 0 || index > this.size() - 1) return undefined;
        const removeItem = this.data.splice(index, 1);
        return removeItem.at(0);
    }

    poll() {
        return this.data.shift();
    }

    peek(): T | undefined {
        return this.data.at(0);
    }

    isEmpty() {
        return this.data.length === 0;
    }

    size() {
        return this.data.length;
    }

    clear() {
        this.data = [];
    }

    contains(callback: (e: T, index?: number, all?: T[]) => boolean): boolean {
        return this.data.some(callback);
    }

    iterator(callback: (e: T, index?: number, all?: T[]) => unknown) {
        this.data.forEach(callback);
    }
}

export default Queue;
