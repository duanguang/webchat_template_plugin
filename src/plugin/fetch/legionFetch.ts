/** @format */

import { requestInterceptor,RequestInterceptor,defaultResponse,defaultRequest,defaultRejects } from './fetchRequest';
interface ITaroFetch {
  create: <T>() => {
    get: RequestInterceptor<T>['get'];
    post: RequestInterceptor<T>['post'];
    register: RequestInterceptor<T>['register'];
    request: RequestInterceptor<T>['request'];
  };
  instance: InstanceType<typeof RequestInterceptor>;
}
export const taroFetch: ITaroFetch = {
  create: () => {
    const context = new RequestInterceptor();
    defaultRequest.map((item) => {
      context.register(item);
    });
    defaultResponse.map((item) => {
      context.register(item);
    });
    defaultRejects.map((item) => {
      context.register(item);
    });
    return {
      get: context.get.bind(context),
      post: context.post.bind(context),
      register: context.register.bind(context),
      request: context.request.bind(context)
    };
  },
  instance: requestInterceptor,
};
