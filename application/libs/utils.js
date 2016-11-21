module.exports={
  /**
  * Determine if a value is not an empty object or array or a false value
  * @param value The velue we want to check if it is empty
  * @return boolean
  */
  'isEmpty':function(value)
  {
    return !value || (Array.isArray(value) && !value.length) || !Object.keys(value).length
  },
  'inObject':function(object,value)
  {
      keys=Object.keys(object);

      for (i = 0; i < keys.length; i++)
      {
        if(object[keys[i]]===value)
        {
          return true;
        }
      }

      return false;
  },
  /**
  * Calculate the offest by giving page and limit
  *
  * @param int page The pade STARTING FROM 1
  * @param int limit
  *
  * @return int;
  */
  'offset_calculate':function(page,limit)
  {
    return (parseInt(page)-1)*limit;
  }
}
