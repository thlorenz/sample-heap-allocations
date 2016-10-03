'use strict'

function createEmptyArray(size) {
  return new Array(size)
}

const ITER = 256

exports.innerOuterArray = function innerOuterArray() {
  const arr = []
  const OUTER_ITER = ITER / 20
  const INNER_ITER = OUTER_ITER * 10

  for (let j = 0; j < OUTER_ITER; j++) {
    let innerArr = []
    for (let i = 0; i < INNER_ITER; i++) {
      innerArr.push({ i: i })
    }
    arr.push(innerArr)
  }
  return arr
}

exports.flatArray = function flatArray() {
  const A = []
  function fillArray() {
    for (var i = 0; i < ITER; ++i) {
      A[i] = createEmptyArray(24)
    }
  }
  fillArray()
  return A
}
