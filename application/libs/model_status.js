function ActionStatus()
{
  var self=this;

  /**
  * Indicates if a status id successfull or not
  */
  var status=null;

  /**
  * Usefull Constants in order to define the ok and errorous status
  */
  const OK=true;
  const ERROR=false;

  /**
  * Method that indicates that the action youy didi has a successfull result
  */
  self.statusOK=function()
  {
    status=OK;
  }

  /**
  * Returns true if this status action is ok
  * @return boolean
  */
  self.isOk=function()
  {
    return status===OK;
  }

  /**
  * Error type Literals
  */
  self.errorTypes={
    /**
    * Error that indicates that a parameter is misssing
    */
    'missing_param':1,
    /**
    * Error that Indicates that a parameter has not giver correctly
    */
    'wrong_param':2,
    /**
    * Error that Indicates an Internal Error
    */
    'internal':3,
    /**
    * Error that indicated that this action is unauthorised
    */
    'access_denied':4
  }

  self.error_type=null
  /**
  * Set this status action as
  * @param integer type
  */
  self.statusError=function(type)
  {
    console.log(type);
    if(
        type===self.errorTypes.missing_param ||
        type===self.errorTypes.wrong_param  ||
        type===self.errorTypes.internal ||
        type===self.errorTypes.access_denied
      ){
          status=ERROR;
          self.error_type=type;

      }
      else
      {
          throw Error('This error type is not supported');
      }
  }

  /**
  * Returns true if this status action is an errorous one
  * @return boolean
  */
  self.isErr=function()
  {
    return status===ERROR;
  }

  /**
  * Set the message of the following status
  * @var string
  */
  self.message=null

  /**
  * Set the data of the action
  * @var mixed
  */
  self.data=null
}


module.exports=ActionStatus;
