import OMap, {KV, MissingKeyError} from './omap'

describe('.length', () => {
  test('returns 0 when empty', () => {
    expect(new OMap<string, string>().length).toEqual(0)
  })

  test('returns the length of the map', () => {
    const map = new OMap([
      ['foo', 'bar'],
      ['baz', 'qux']
    ])
    expect(map.length).toEqual(2)
  })
})

describe('iteration', () => {
  test('iterates over the values of the map', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])

    expect.assertions(3)

    let i = 0
    for (const value of map) expect(value).toEqual(i++)
  })
})

describe('.get', () => {
  test('returns a value if it exists for the key', () => {
    const map = new OMap([['key', 'value']])
    expect(map.get('key')).toEqual('value')
  })

  test('returns `null` the key is not in the map', () => {
    const map = new OMap()
    expect(map.get('key')).toBeNull()
  })
})

describe('.mustGet', () => {
  test('returns a value if it exists for the key', () => {
    const map = new OMap([['key', 'value']])
    expect(map.mustGet('key')).toEqual('value')
  })

  test('throws if the key is not in the map', () => {
    const map = new OMap()

    expect(() => {
      map.mustGet('key')
    }).toThrowError(MissingKeyError)
  })
})

describe('.at', () => {
  test('returns a value if it exists at the index', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1]
    ])
    expect(map.at(1)).toEqual(1)
  })

  test('returns null if a value is not at the index', () => {
    const map = new OMap()
    expect(map.at(1)).toBeNull()
  })

  test('does not do negative indexing', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1]
    ])
    expect(map.at(-1)).toBeNull()
  })
})

describe('.first', () => {
  test('returns the first value', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1]
    ])
    expect(map.first).toEqual(0)
  })

  test('returns null if there are no values', () => {
    const map = new OMap()
    expect(map.first).toBeNull()
  })
})

describe('.last', () => {
  test('returns the last value', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])
    expect(map.last).toEqual(2)
  })

  test('returns null if there are no values', () => {
    const map = new OMap()
    expect(map.last).toBeNull()
  })
})

describe('.getPreviousSibling', () => {
  test('gets the value before the given key', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])
    expect(map.getPreviousSibling('two')).toEqual(1)
  })

  test('returns `null` if the key is the first', () => {
    const map = new OMap([['zero', 0]])
    expect(map.getPreviousSibling('zero')).toBeNull()
  })

  test('returns `null` if the key is not in the omap', () => {
    const map = new OMap()
    expect(map.getPreviousSibling('none')).toBeNull()
  })
})

describe('.indexOf', () => {
  test('returns the index of the key in the map', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])
    expect(map.indexOf('one')).toEqual(1)
  })

  test('returns -1 if the key is not in the map', () => {
    const map = new OMap()
    expect(map.indexOf('none')).toEqual(-1)
  })
})

describe('.insertAfter', () => {
  test('inserts a new value after the given key', () => {
    const map = new OMap([
      ['zero', 0],
      ['two', 2]
    ])
    map.insertAfter('zero', ['one', 1])
    expect(map.getPreviousSibling('two')).toEqual(1)
  })

  test('throws if the target key is not in the map', () => {
    const map = new OMap()
    expect(() => map.insertAfter('zero', ['one', 1])).toThrowError(
      MissingKeyError
    )
  })
})

describe('.unshift', () => {
  test('adds values to the start of the list', () => {
    const map = new OMap([['two', 2]])
    map.unshift(['zero', 0], ['one', 1])
    expect(map.toArray()).toEqual([0, 1, 2])
  })
})

describe('.push', () => {
  test('adds values to the start of the list', () => {
    const map = new OMap([['zero', 0]])
    map.push(['one', 1], ['two', 2])
    expect(map.toArray()).toEqual([0, 1, 2])
  })
})

describe('.delete', () => {
  test('removes the value from the map', () => {
    const map = new OMap([
      ['zero', 0],
      ['two', 2],
      ['one', 1]
    ])
    map.delete('two')
    expect(map.toArray()).toEqual([0, 1])
  })
})

describe('.forEach', () => {
  test('iterates over the values in the map', () => {
    expect.assertions(3)

    let i = 0

    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])

    map.forEach(v => expect(v).toEqual(i++))
  })
})

describe('.map', () => {
  test('maps over the values in the map', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])

    const values = map.map(v => v)

    expect(values).toEqual([0, 1, 2])
  })
})

describe('.toArray', () => {
  test('returns the map values', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])

    expect(map.toArray()).toEqual([0, 1, 2])
  })
})

describe('.entries', () => {
  test('returns the ordered map entires', () => {
    const entries: KV<string, number>[] = [['zero', 0],
      ['one', 1],
      ['two', 2]]

    const map = new OMap(entries)

    expect(map.entries()).toEqual(entries)
  })
})

describe('.reduce', () => {
  test('calls a reduce function over the map values', () => {
    const map = new OMap([
      ['zero', 0],
      ['one', 1],
      ['two', 2]
    ])

    const sum = map.reduce((sum, v) => sum + v, 0)

    expect(sum).toEqual(3)
  })
})
