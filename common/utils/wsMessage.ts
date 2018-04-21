
type WsMessage = [string, any];

/**
 * Parse webSockets message string
 * @param msg webSockets message string
 */
const parse = (msg: string): WsMessage => {
  let message: WsMessage = ['',  null];

  try {
    message = JSON.parse(msg);
  } catch (e) {
    message[0] = msg;
  }

  return message;
};

/**
 * Prepare webSockets message string
 * @param type message type key
 * @param data additional data
 */
const prep = (type: string, data?: any): string => {
  if (!type) {
    return '';
  }

  return JSON.stringify(data === undefined ? [type] : [type, data]);
};

export default {
  parse,
  prep,
};
