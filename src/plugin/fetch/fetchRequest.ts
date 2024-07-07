/** @format */
import { mergeConfig } from './helpers/utils';
import Taro from '@tarojs/taro';
const HeadersPrams = ['Content-Type','api-target','api-cookie','Cache-Control'];
type HeadersPrams = {
  'Content-Type'?:
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'application/octet-stream';
  'api-target'?: string;
  'api-cookie'?: string;
  /** other */
  [x: string]: any;
};
export interface IFetchRequestOption extends Taro.request.Option {
  baseURL?: string;
  transformRequest?: (config: IRequestConfigs,url: string) => IRequestConfigs;
  header?: HeadersPrams;
}
interface IRequestConfigs extends IFetchRequestOption {
  proxyURL?: string;
}
interface Interceptor {
  request?: (config: IRequestConfigs) => Promise<IRequestConfigs> | IRequestConfigs;
  response?: <T>(response: Taro.RequestTask<T>,config: IRequestConfigs) => Taro.RequestTask<T>;
  responseReject?: (response: TaroGeneral.CallbackResult,config: IRequestConfigs) => TaroGeneral.CallbackResult;
}

export class RequestInterceptor<T> {
  private _requests: Array<(config: IRequestConfigs) => Promise<IRequestConfigs> | IRequestConfigs>;
  private _responses: Array<
    (response: Taro.RequestTask<T>,config: IRequestConfigs) => Taro.RequestTask<T>
  >;
  private _responseRejects: Array<(response: TaroGeneral.CallbackResult,config: IRequestConfigs) => TaroGeneral.CallbackResult>;

  constructor() {
    this._requests = [];
    this._responses = [];
    this._responseRejects = [];
  }
  private _requestPromise(defaultConfigs: { url: string; options: IRequestConfigs }) {
    defaultConfigs = defaultConfigs || {};
    let urls = defaultConfigs['url'] || '';
    const { _requests } = this;
    //遍历请求前的拦截方法
    const requestPromise: Promise<IRequestConfigs> = _requests.reduce((prev,cur) => {
      return prev.then(cur);
    },Promise.resolve({ url: urls,options: defaultConfigs.options }));
    return requestPromise;
  }
  request<T>(options: IRequestConfigs): Taro.RequestTask<T> {
    options = options || {};
    let urls = options['url'] || '';
    let promise = this._send({ url: urls,options });
    //@ts-ignore
    return promise;
  }

  register(interceptor: Interceptor) {
    const { _requests,_responses,_responseRejects } = this;
    const { request,response,responseReject } = interceptor;
    request && _requests.push(request);
    response && _responses.push(response);
    responseReject && _responseRejects.push(responseReject);
  }
  get<T>(options: IRequestConfigs): Taro.RequestTask<T> {
    options = options || {};
    options.method = 'GET';
    let promise = this._send({ url: options.url || '',options });
    //@ts-ignore
    return promise;
  }
  post<T>(options: IRequestConfigs): Taro.RequestTask<T> {
    options = options || {};
    options.method = 'POST';
    let promise = this._send({ url: options.url as string,options });
    //@ts-ignore
    return promise;
  }

  private async _send(defaultConfigs: { url: string; options: IFetchRequestOption }): Promise<Taro.request.SuccessCallbackResult<any>> {
    const { _responses,_responseRejects } = this;
    //遍历请求前的拦截方法
    const requestPromise = this._requestPromise(defaultConfigs);
    let _configs;
    let response = requestPromise.then((configs: IRequestConfigs) => {
      let url =configs.url;
      if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
        url = `${configs?.baseURL || ''}${configs.url}`;
      }
      if (typeof defaultConfigs.options.transformRequest === 'function') {
        configs = defaultConfigs.options.transformRequest(configs,url);
      }
      configs.url = url;
      _configs = {...configs};
      return Taro.request({
        fail:(res)=> {
          _responseRejects.reduce((prev,cur) => {
            return prev.then(
              (value) => {
                return cur(value,defaultConfigs);
              },
              (err) => {
                return cur(err,defaultConfigs);
              },
            );
          },Promise.resolve(res))
        },
        ...configs,
      });
    });
    response = _responses.reduce((prev,cur) => {
      return prev.then((value) => {
        //@ts-ignore
        return cur(value,_configs);
      });
    },response);
    return response.then(
      (value) => {
        return Promise.resolve(value);
      }
    );
  }
}
function tranfromOptions(options) {
  if (options && typeof options === 'object' && !Array.isArray(options)) {
    if (!options['header']) {
      const headers = {};
      HeadersPrams.forEach(function (item) {
        if (options[item]) {
          headers[item] = options[item];
          delete options[item];
        }
      });
      options['header'] = headers;
    }
  }
  return options;
}

const requestInterceptor = new RequestInterceptor();

export const defaultRequest: Interceptor[] = [
  {
    request: (configs: IRequestConfigs /**  传入进来的配置参数*/) => {
      //注册拦截请求, 默认所有请求返回json格式
      /**  设置默认request */
      let options = {
        header: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        /**  超时时间*/
        timeout: 50000,
      };
      /**  使用传入进来的配置覆盖默认配置*/
      //@ts-ignore
      let config: IRequestConfigs = mergeConfig(options,{ ...tranfromOptions(configs['options']),url: configs.url });
      return config;
    },
  },
];
defaultRequest.map((item) => {
  requestInterceptor.register(item);
});
export const defaultResponse: Interceptor[] = [
  {
    response: (response,config: IRequestConfigs) => {
      return response;
    },
  },
];
defaultResponse.map((item) => {
  requestInterceptor.register(item);
});
export const defaultRejects: Interceptor[] = [
  {
    responseReject: (response,config) => {
      return response;
    },
  },
];
defaultRejects.map((item) => {
  requestInterceptor.register(item);
});
type multiParamsGet = <T = any>(options: IRequestConfigs) => Taro.RequestTask<T>;
type singleParamsGet = <T = any>(options: IRequestConfigs) => Taro.RequestTask<T>;
export type TypeGet = singleParamsGet & multiParamsGet;
export type TypePost = singleParamsGet & multiParamsGet;
export { requestInterceptor };
export const get = requestInterceptor.get.bind(requestInterceptor) as TypeGet;
export const post = requestInterceptor.post.bind(requestInterceptor) as TypePost;
