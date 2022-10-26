/**
 * Throttle events.
 *
 * @param {function} callback
 * @param {number} timeout
 */
const throttle = (callback, timeout) => {
  let isThrottling = false;

  return function () {
    if (isThrottling) {
      return;
    }

    isThrottling = true;

    setTimeout(() => {
      func.apply(this, arguments);
      isThrottling = false;
    }, timeout);
  };
};
