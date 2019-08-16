import axios from './AxiosHeader'

export const fetchingDataAPI = (values) => {
	  return axios().get(values).then(response => {
	    return response.data
	  })
}

export const postingDataAPI = async (values,data) => {
	  return await axios().post(values,data).then(response => {
	    return {response : response.status}
	  }).catch((err) => {
    	return err
    });
}
export const putDataAPI = async (values,data) => {
	  return await axios().put(values,data).then(response => {
	    return {response : response.status}
	  }).catch((err) => {
    	return err
    });
}

export const patchDataAPI = async (values,data) => {
	  return await axios().patch(values,data).then(response => {
	    return {response : response.status}
	  }).catch((err) => {
    	return err
    });
}

export const fetchingListData = (values) => {
	  return axios().get(values).then(response => {
	    return response
	  })
}

export const deleteData = (url,data) => {
	  return axios().delete(url,data).then(response => {
	    return response
	  })
}

const getMultipleAxios = (values = [],method) => {
	let bracketObject = []
	if(method === 'get'){
		values.map((k,i) => {
			return bracketObject.push({func : axios().get(k)}
			);
		});
	}
	if(method === 'post'){
		values.map((k,i) => {
			return bracketObject.push({
				func : axios().post(k.value,k.data)
			})
		});
	}
	return bracketObject
}

export const fetchingMultipleDataAPI = (values) => {
	let bracketFunction = [];
	const getFunctionObject = getMultipleAxios(values,'get');
	getFunctionObject.map((k,i) => {
		return bracketFunction.push(k.func)
	})

   return Promise.all(bracketFunction)
    .then(results => {
    	return results
    })
    .catch(error => {
      	return error
    });
}

export const postingMultipleDataAPI = (values) => { 
	const postFinally = values.map( async (k,i) => {
		return await postingDataAPI(k.value,k.data).then(result => result)
	})
   return Promise.all(postFinally)
    .then(results => {
   		return results
    })
    .catch(error => {
      	return error
    });
}