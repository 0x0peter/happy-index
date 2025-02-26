import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useLoading } from "@/store/globalState";

type HttpMethod = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch';


const useAxios = () => {
    const { toast } = useToast();


    // 创建axios实例
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'accept': '*/*'
        }
    });

   

    const http = async <T = any>(method: HttpMethod, url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        const startTime = Date.now();
        return instance[method](url, data, config)
            .then((response: AxiosResponse<T>) => {
                const requestTime = (Date.now() - startTime) / 1000;
                toast({
                    title: '请求成功',
                    description: `请求成功，用时${requestTime}秒.`,
                    duration: 1500,
                });
                return response;
            })
            .catch((error) => {
                toast({
                    title: '请求失败',
                    description: `请求失败 ${error.message}`,
                    duration: 1500,
                });
                return error;
            });
    }

    const get = <T = any>(url: string, config?: AxiosRequestConfig) => http<T>('get', url, undefined, config);
    const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => http<T>('post', url, data, config);
    const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => http<T>('put', url, data, config);
    const del = <T = any>(url: string, config?: AxiosRequestConfig) => http<T>('delete', url, undefined, config);
    const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => http<T>('patch', url, data, config);
    const head = <T = any>(url: string, config?: AxiosRequestConfig) => http<T>('head', url, undefined, config);
    const options = <T = any>(url: string, config?: AxiosRequestConfig) => http<T>('options', url, undefined, config);
    const all = <T = any>(requests: Array<Promise<T> | T>) => axios.all(requests);

    return { get, post, put, del, patch, head, options, all };
};

export default useAxios;
