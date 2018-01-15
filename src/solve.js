
function getIdent(config) {
  return config.map(x => x).sort().map(x => x.toString()).join('_');
}

function* possibles(n) {
  if (n === 1) {
    yield [[], 0, 0];
    return;
  }

  let known = new Set();
  for (let a = 0; a < n - 1; a++) {
    for (let b = a; b < n; b++) {
      let t = [];
      if (a > 0) {
        t.push(a);
      }
      if (b < n - 1) {
        t.push(n - 1 - b);
      }
      // t = t.sort();
      const tident = getIdent(t);
      if (!known.has(tident)) {
        known.add(tident);
        yield [t, a, b];
      }
    }
  }
}

function* permutate(config) {
  let known = new Set();
  for (let i = 0; i < config.length; i++) {
    for (let [p, a, b] of possibles(config[i])) {
      let t = p.concat(config.slice(0, i)).concat(config.slice(i + 1));
      // t = t.sort();
      const tident = getIdent(t);
      if (!known.has(tident)) {
        known.add(tident);
        yield [t, config[i], a, b];
      }
    }
  }
}

let dp = new Map()
dp.set(getIdent([1]), false);

export function get(config) {
  let ident = getIdent(config);
  if (dp.has(ident)) {
    return dp.get(ident);
  }

  for (let [p, prev, a, b] of permutate(config)) {
    let r = get(p);
    // console.log(p, r)
    if (!r) {
      dp.set(getIdent(config), {prev, a, b});
      return {prev, a, b};
    }
  }

  dp.set(getIdent(config), false);
  return false;
}

export function apply(config, rule) {
  let ret = [];
  let change_done = false;
  for (let i = 0; i < config.length; i++) {
    if (!change_done && config[i] === rule.prev) {
      change_done = true;
      if (rule.a > 0) {
        ret.push(rule.a);
      }
      if (rule.b < config[i] - 1) {
        ret.push(config[i] - 1 - rule.b);
      }
    } else {
      ret.push(config[i]);
    }
  }

  return ret;
}

// console.log(get([1, 1]));
// console.log(get([2]));
// console.log(get([3]));
// console.log(get([2,2]));
// console.log(permutate([2,2, 1]));
// console.log([...permutate([1, 1])]);
// console.log(get([5, 6]));
// console.log([...possibles(1)])



// let config = [6,5,3,100,6,3];
// let player = 1;
// while(true) {
//   let rule = get(config);
//   if(!rule){
//     console.log("player"+player+" lost");
//     break;
//   }
//   config = apply(config, rule);
//   console.log("player"+player+": "+JSON.stringify(rule), config);
//   player = player == 1 ? 2 : 1;
// }

// console.log("hits:", hits, "misses:", misses);

// export default {
//   get, apply
// };
