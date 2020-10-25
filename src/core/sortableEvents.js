const manageAndEmit = ["Start", "Add", "Remove", "Update", "End"];
const emit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
const manage = ["Move"];
const eventHandlerNames = [...manage, ...manageAndEmit, ...emit].map(
  evt => `on${evt}`
);

const events = {
  manage,
  manageAndEmit,
  emit
};

function isReadOnlyEvent(eventName) {
  return eventHandlerNames.indexOf(eventName) !== -1;
}

export { events, isReadOnlyEvent };
