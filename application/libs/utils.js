module.exports={
  /**
  * Determine if a value is not an empty object or array or a false value
  * @param value The velue we want to check if it is empty
  * @return boolean
  */
  'isEmpty':function(value)
  {
    return !value || (Array.isArray(value) && !value.length) || !Object.keys(value).length
  }
}
