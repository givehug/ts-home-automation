import Vue from 'vue';

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

Vue.filter('time', (value: any) => {
  const date = new Date(value);

  return date ? date.toLocaleTimeString([], dateOptions) : value;
});
