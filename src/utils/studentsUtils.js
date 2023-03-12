import Status from '../enums/StatusEnum';

export function getStatus(statuses) {
  const latestStatus = statuses?.sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.type;

  return latestStatus === Status.GOOD ? 'GOOD' :
        latestStatus === Status.PROBATION ? 'PROBATION' :
        latestStatus === Status.INACTIVE ? 'INACTIVE' : 'WITHDRAWN';
};


export function filterBySoundex(arr, term) {
    const soundexTerm = soundex(term);
      return arr.filter((item) => {
        return (
          soundex(item.name) === soundexTerm ||
          soundex(item.phone) === soundexTerm ||
          soundex(item.email) === soundexTerm ||
          soundex(item.major) === soundexTerm ||
          soundex(getStatus(item.status)) === soundexTerm
        );
      });
    };

const soundex = (word) => {
    const sdx = [0, 0, 0, 0];
    const m = new Map([
        ['b', 1],
        ['f', 1],
        ['p', 1],
        ['v', 1],
        ['c', 2],
        ['g', 2],
        ['j', 2],
        ['k', 2],
        ['q', 2],
        ['s', 2],
        ['x', 2],
        ['z', 2],
        ['d', 3],
        ['t', 3],
        ['l', 4],
        ['m', 5],
        ['n', 5],
        ['r', 6]
    ]);

    const chars = word.toLowerCase().split('');
    let i = 0;
    let j = 1;
    sdx[i] = chars[0];
    for (let k = 1; k < chars.length && i < 3; k++) {
        const code = m.get(chars[k]);
        if (code && code !== m.get(chars[k - 1])) {
        i++;
        sdx[i] = code;
        }
    }
    while (j < 4) {
        sdx[j] = 0;
        j++;
    }
    return sdx.join('');
    };