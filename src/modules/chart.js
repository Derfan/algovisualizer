const DELAY = 600;
const settings = {
  width: 800,
  height: 500,
};
const textWidthByLength = { 1: 8, 2: 16, 3: 24 };

class Chart {
  constructor() {
    this.chart = document.getElementById('chart');
    this.elements = [];

    this.chart.setAttribute('width', settings.width);
    this.chart.setAttribute('height', settings.height);
    this.chart.setAttribute('viewPort', `0 0 ${settings.width} ${settings.height}`);
  }

  clear() {
    this.elements = [];
    this.chart.innerHTML = '';
  }

  update(elements) {
    this.clear();
    this.render(elements);
  }

  updateCurrentOffset(idx, value) {
    const element = this.elements[idx];

    element.currentOffset = value;
  }

  moveElement(idx, { steps, direction }) {
    const { currentOffset, offset, node } = this.elements[idx];
    const x = {
      right: currentOffset + steps * offset,
      left: currentOffset - steps * offset,
    }[direction];

    node.setAttribute('style', `transform: translate(${x}px, 0);`);
    this.updateCurrentOffset(idx, x);
  }

  swap(idx1, idx2) {
    const elem1 = this.elements[idx1];
    const elem2 = this.elements[idx2];

    return new Promise((resolve) => {
      setTimeout(() => {
        if (elem1.value > elem2.value) {
          this.moveElement(idx1, { steps: 1, direction: 'right' });
          this.moveElement(idx2, { steps: 1, direction: 'left' });

          this.elements[idx1] = elem2;
          this.elements[idx2] = elem1;
        }
        resolve();
      }, DELAY);
    });
  }

  async bubbleSort() {
    let to = this.elements.length - 1;

    for (let j = 0; j < this.elements.length; j += 1) {
      for (let i = 0; i < to; i += 1) {
        const lerfRect = this.elements[i].node.querySelector('rect');
        const rightRect = this.elements[i + 1].node.querySelector('rect');

        lerfRect.style.fill = 'yellow';
        rightRect.style.fill = 'yellow';

        await this.swap(i, i + 1);

        lerfRect.style.fill = '';
        rightRect.style.fill = '';
      }

      const lastRect = this.elements[to].node.querySelector('rect');

      lastRect.style.fill = 'green';

      to -= 1;
    }

    this.showSuccesMessage();
  }

  fillElement(idx, fill) {
    const element = this.elements[idx];
    const rect = element.node.querySelector('rect');

    rect.style.fill = fill;

    return element;
  }

  async selectionSort() {
    let from = 0;

    for (let i = 0; i < this.elements.length; i += 1) {
      let min = this.fillElement(from, 'yellow');

      for (let j = from + 1; j < this.elements.length; j += 1) {
        const current = this.fillElement(j, 'purple');

        await new Promise(resolve => {
          setTimeout(() => {
            if (current.value < min.value) {
              this.fillElement(this.elements.indexOf(min), '');
              min = this.fillElement(j, 'yellow');
            } else {
              this.fillElement(j, '');
            }
            resolve();
          }, DELAY);
        });
      }

      const minIdx = this.elements.indexOf(min, from);

      this.moveElement(minIdx, { direction: 'left', steps: minIdx - from });
      this.moveElement(from, { direction: 'right', steps: minIdx - from });
      this.fillElement(minIdx, 'green');
      this.elements[minIdx] = this.elements[from];
      this.elements[from] = min;

      from += 1;
    }

    this.showSuccesMessage();
  }

  sort(type) {
    console.log('Sorting type: ', type);

    this[type]();
  }

  showSuccesMessage() {
    const containerWidth = this.chart.width.baseVal.value;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const textNode = document.createTextNode('Done!');
    const textWidth = 102.61;

    text.appendChild(textNode);
    text.setAttribute('x', containerWidth / 2 - textWidth / 2);
    text.setAttribute('y', 300);

    text.style.fontSize = '40px';
    text.style.fill = 'red';

    this.chart.appendChild(text);
  }

  render(nums) {
    const containerWidth = this.chart.width.baseVal.value;
    const gapWidth = containerWidth * 0.0005;
    const elementWidth = (containerWidth / nums.length) - gapWidth * 2;
    const offset = elementWidth + gapWidth * 2;
    let xElementPosition = gapWidth;

    for (let i = 0; i < nums.length; i += 1) {
      const number = nums[i];
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const textNode = document.createTextNode(number);
      const textWidth = textWidthByLength[`${number}`.length];

      rect.setAttribute('fill', '#0088CC');
      rect.setAttribute('rx', 10);
      rect.setAttribute('x', xElementPosition);
      rect.setAttribute('width', elementWidth);
      rect.setAttribute('height', number);
      group.appendChild(rect);
      text.setAttribute('x', elementWidth / 2 - textWidth / 2 + xElementPosition);
      text.setAttribute('y', number + 16);
      text.appendChild(textNode);
      group.setAttribute('style', 'transform: translate(0, 0)');
      group.appendChild(text);

      this.chart.appendChild(group);
      this.elements.push({
        node: group,
        value: number,
        currentOffset: 0,
        offset,
      });

      xElementPosition += offset;
    }
  }
}

export default Chart;
