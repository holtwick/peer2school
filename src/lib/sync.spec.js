describe('Sync', () => {

  // Ugly hack for now

  function encode(v) {
    return Buffer.from(v).toJSON().data
  }

  function decode(v) {
    return new Uint8Array(Buffer.from(v).toJSON().data)
  }

  it('should encode and decode', () => {
    const sample = [1, 2, 3]
    let arr = new Uint8Array(sample)
    // let data = Buffer.from(arr).toJSON().data
    let data = encode(arr)
    // console.log(data, arr)
    expect(data).toEqual(sample)
    // let arr2 = new Uint8Array(Buffer.from(data).toJSON().data)
    let arr2 = decode(data)
    expect(arr).toEqual(arr2)
  })

})
