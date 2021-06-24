import FormModel from './model';
import FormView from './view';

class FormController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.callbacks = new Map();

    this.changeArrayLengthHandler = this.changeArrayLengthHandler.bind(this);
    this.submitFormHandler = this.submitFormHandler.bind(this);
  }

  get arrayLength() {
    return this.model.arrayLength;
  }

  set arrayLength(value) {
    this.model.arrayLength = value;
    this.view.lengthTextNode.innerText = value;
  }

  set eventHandlers(handlers) {
    this.callbacks = handlers.reduce(
      (acc, { type, cb }) => (acc.has(type)
        ? acc.set(type, acc.get(type).add(cb))
        : acc.set(type, new Set([cb]))),
      this.callbacks,
    );
  }

  emitCallbacks(type, ...args) {
    const callbackList = this.callbacks.get(type);

    callbackList.forEach((cb) => cb(...args));
  }

  changeArrayLengthHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    const { value } = event.target;

    this.arrayLength = value;
    this.emitCallbacks('change', value);
  }

  submitFormHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    const { elements: { sortingType } } = event.target;

    this.emitCallbacks('submit', sortingType.value);
  }

  addListeners() {
    this.view.lengthInput.addEventListener('change', this.changeArrayLengthHandler);
    this.view.htmlForm.addEventListener('submit', this.submitFormHandler);
  }

  init(handlers) {
    this.eventHandlers = handlers;
    this.view.sortingTypeOptions = this.model.sortingOptions;
    this.view.render({ arrayLength: this.arrayLength });
    this.addListeners();
  }
}

export default new FormController(new FormModel(), new FormView());
