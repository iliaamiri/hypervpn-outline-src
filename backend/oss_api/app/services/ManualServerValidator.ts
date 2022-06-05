import {IValidator, ValidationResult, Validator} from 'ts.validator.fluent/dist';
import IManualServerDto from "../models/IManualServerDto";
import IDataLimit from "../interfaces/AccessKey/IDataLimit";
import IBandwidthThreshold from "../interfaces/ManualServer/IBandwidthThreshold";

export default async function ManualServerValidator(model: IManualServerDto): Promise<ValidationResult> {
  let validateDataLimitRules = (validator: IValidator<IDataLimit>): ValidationResult => {
    return validator
      .NotNull(m => m.bytes, "Should not be null", "IDataLimit.bytes.Null")
      .Required(m => m.bytes, (m, bytes) => (typeof bytes === "string" && !isNaN(parseInt(bytes))), "Must be a number", "IDataLimit.bytes.Number")
      .Required(m => m.bytes, (m, bytes) => bytes > 0, "Must be bigger than zero", "IDataLimit.bytes.BiggerThanZero")
      .ToResult();
  };
  
  let validateBandwidthThreshold = (validator: IValidator<IBandwidthThreshold>): ValidationResult => {
    return validator
      .NotNull(m => m.megaBytes, "Should not be null", "IBandwidthThreshold.megaBytes.Null")
      .Required(m => m.megaBytes, (m, megaBytes) => (typeof megaBytes === "string" && !isNaN(parseInt(megaBytes))), "Must be a number", "IBandwidthThreshold.megaBytes.Number")
      .Required(m => m.megaBytes, (m, megaBytes) => megaBytes > 0, "Must be bigger than zero", "IBandwidthThreshold.megaBytes.BiggerThanZero")
      .ToResult();
  };
  
  let validateManualServerRules = (validator: IValidator<IManualServerDto>) : ValidationResult => {
    return validator
      .NotNull(m => m.name, "Should not be null", "IManualServerDto.name.Null")
      
      .NotNull(m => m.defaultDataLimit, "Should not be null", "IManualServerDto.defaultDataLimit.Null")
      .If(m => m.defaultDataLimit != null, validator => validator.ForType(m => m.defaultDataLimit, validateDataLimitRules).ToResult())
      
      .NotNull(m => m.bandwidthThreshold, "Should not be null", "IManualServerDto.bandwidthThreshold.Null")
      .If(m => m.bandwidthThreshold != null, validator => validator.ForType(m => m.bandwidthThreshold, validateBandwidthThreshold).ToResult())
      
      .NotNull(m => m.isMetricsEnabled, "Should not be null", "IManualServerDto.isMetricsEnabled.Null")
      .NotNull(m => m.host, "Should not be null", "IManualServerDto.host.Null")
      .NotNull(m => m.managementApiUrl, "Should not be null", "IManualServerDto.host.Null")
      .NotNull(m => m.portForNewAccessKeys, "Should not be null", "IManualServerDto.portForNewAccessKeys.Null")
      .Required(m => m.isMetricsEnabled, (m, isMetricsEnabled) => (typeof isMetricsEnabled === "boolean"), "Must be boolean", "IManualServerDto.isMetricsEnabled.Required.Boolean")
      .ToResult();
  };

  return new Validator(model).Validate(validateManualServerRules);
}