import request from '@/utils/request'

export function getImgesList () {
    return new Promise ((resolve,reject)=>{
        request({
            url:'/imageList',
            method:'get',
        })
        .then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    })
}