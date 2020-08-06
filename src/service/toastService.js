import 'react-toastify/dist/ReactToastify.css';
import { Component } from 'react';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default class apiService extends Component {

    static createToast(content, type) {
        if (type === "success") {
            toast.success(content)
        } else if (type === "info") {
            toast.info(content)
        } else if (type === "error") {
            toast.error(content)
        } else if (type === "warning") {
            toast.warning(content)
        } else if (type === "dark") {
            toast.dark(content)
        } else {
            toast.default(content)
        }
    }
}