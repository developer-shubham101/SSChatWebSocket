import {CUSTOMER_TYPE} from '../../types';
import {AppOperation} from "../../index";

export default (appOperation: AppOperation) => ({

    updatePhotoPass: (postData: FormData | { [key: string]: any }) => appOperation.post('/?url=upload', postData, CUSTOMER_TYPE),

    // callGetAPI: () => appOperation.get('/V1/carts/mine/estimate-shipping-methods', undefined, undefined, CUSTOMER_TYPE),
});
