import { gatewayRequest } from "./request";
export class DemoApi {
    /**获取工单进度表 */
    async getProgressList(options: {
        pageIndex: number;
        pageSize: number;
        productionDeptCode?: string;
        stationTypeName?: string;
        itemNo?: string;
        goodsModel?: string;
    }) {
        return gatewayRequest.post(
            {
                data: options,
                proxyURL:`https://demo2-api.hoolinks.com/mom/mes/item/itemProgress/findPage`,
                url: `/mom/mes/item/itemProgress/findPage`
            },
        ).then((res) => {
            return res;
        });
    }
    /** 工单排机-选择工单后的详情 */
    async getDetail(itemId: string) {
        return gatewayRequest.get(
            {
                data: {
                    itemId, 
                },
                proxyURL:`https://demo2-api.hoolinks.com/mom/mes/item/getDetail`,
                url: `/mom/mes/item/getDetail`
            },
        ).then((res) => {
            return res;
        });
    }
}

export const demoApi = new DemoApi();