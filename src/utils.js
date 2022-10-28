/**
 * Throttle events.
 *
 * @param {function} callback
 * @param {number} timeout
 */
const throttle = (callback, timeout = 100) => {
  let isThrottling = false;

  return function () {
    if (isThrottling) {
      return;
    }

    isThrottling = true;

    setTimeout(() => {
      callback.apply(this, arguments);
      isThrottling = false;
    }, timeout);
  };
};

export { throttle };
