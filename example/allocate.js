'use strict'

function createEmptyArray(size) {
  return new Array(size)
}

exports.innerOuterArray = function innerOuterArray() {
  const arr = []
  const OUTER_ITER = 1024
  const INNER_ITER = 1024 * 10

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
    for (var i = 0; i < 1024; ++i) {
      A[i] = createEmptyArray(1024)
    }
  }
  fillArray()
  return A
}
