export const messageToJSON = (msg) => {
  let message = [
    '',
    null,
  ];

  try {
    message = JSON.parse(msg);
  } catch (e) {
    message[0] = msg;
  }

  return message;
};

export const jsonToMessage = (type, data) => {
  if (!type) {
    return '';
  }

  return JSON.stringify(data === undefined ? [type] : [type, data]);
};
