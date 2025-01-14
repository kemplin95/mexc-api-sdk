import { buildQueryString, createRequest, removeEmptyValue } from '../util';
import * as crypto from 'crypto';

export class Base {
  public config: any = {};
  constructor(apiKey: any, apiSecret: any) {
    this.config.apiKey = apiKey;
    this.config.apiSecret = apiSecret;
    // this.config.baseURL = 'https://www.mxctest.com/open/api/v2';
    this.config.baseURL = 'https://gatewayapi.mxctest.com/api/v3';
  }

  public publicRequest (method: any, path: any, paramsObj: any = {}): any {
    paramsObj = removeEmptyValue(paramsObj)
    paramsObj = buildQueryString(paramsObj)
    if(paramsObj !== '') {
      path = `${path}?${paramsObj}`
    }

    return createRequest({
      method: method,
      baseURL: this.config.baseURL,
      url: path,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': this.config.apiKey
      }
    })
  }

  public signRequest(method: any, path: any, paramsObj: any = {}): any {
    const timestamp = Date.now()
    paramsObj = removeEmptyValue(paramsObj)
    const queryString = buildQueryString({ ...paramsObj, timestamp })
    const signature = crypto
        .createHmac('sha256', this.config.apiSecret)
        .update(queryString)
        .digest('hex')

    return createRequest({
      method: method,
      baseURL: this.config.baseURL,
      url: `${path}?${queryString}&signature=${signature}`,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': this.config.apiKey
      }
    })
  }
}
