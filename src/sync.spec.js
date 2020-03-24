describe('Sync', () => {

  function encode(v) {
    return JSON.stringify(Array.from(v))
  }

  function decode(v) {
    return Uint8Array.from(JSON.parse(v))
  }

  it('should encode and decode', () => {
    const sample = [1, 2, 3]
    let arr = new Uint8Array(sample)
    let data = encode(arr)
    // expect(data).toEqual(sample)
    let arr2 = decode(data)
    expect(arr).toEqual(arr2)
  })

})
