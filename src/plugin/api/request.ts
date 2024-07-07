import Taro from "@tarojs/taro";
import { taroFetch } from "legions-taro-fetch";
const TOKEN = "NzhiYzRlZmQtODdjYi00ZDE3LTgzZjgtZDMxOTVjMDZiNWU2";
taroFetch.instance.register({
    request: (config) => {
        config['baseURL'] = 'https://demo2-api.hoolinks.com';
        config['header'] = {
            ...config['header'],
            'HL-Access-Token': TOKEN,
            'Cache-Control': 'no-cache',
        }
        return config;
    }
})

const gatewayRequest = taroFetch.create();
gatewayRequest.register({
    request: (config) => {
        config['baseURL'] = 'https://demo2-gateway.hoolinks.com/api/gateway';
        /*  #ifdef weapp  */
        if (Taro.getAccountInfoSync().miniProgram.envVersion === 'trial') {
            
        }
        /*  #endif  */
        config['header'] = {
            ...config['header'],
            'HL-Access-Token': TOKEN,
            'api-target': config.proxyURL,
            'api-cookie': `HL-Access-Token=${TOKEN}; UCTOKEN=${TOKEN};`,
            'Cache-Control': 'no-cache',
        }
        console.log(Taro.getAccountInfoSync().miniProgram.envVersion)
        return config;
    }
})
export {gatewayRequest}