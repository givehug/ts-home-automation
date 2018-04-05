import {keyBy, pick, map, flow, compose} from 'lodash/fp';

const deviceProps = ['name', 'type', '_id', 'description'];

  console.log(
    compose([
      keyBy('_id'),
      map((u) => ({
        ...pick(deviceProps, u),
        booboo: u._id,
      }),
    )])([
      {
        _id: 1,
        name: 'a',
        other: null,
      },
      {
        _id: 2,
        name: 'b',
        other: null,
      },
    ])
  );

// console.log(
//   keyBy('_id',
//   [
//     {
//       _id: 1,
//       name: 'a',
//       other: null,
//     },
//     {
//       _id: 2,
//       name: 'b',
//       other: null,
//     },
//   ])
// );
