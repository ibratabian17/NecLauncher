// Allows to call a Android java function asynchronously
// spawn long running computations/io on the Java/Android without blocking the JS/Website running inside the WebView
// Eg. const result = await callAndroidAsync('javaFunction', { param1: 'value1', param2: 'value2' })
// Please give a star if you find this useful

export async function callAndroidAsync(javaFuncName, params) {
	const rand = 'asyncJava_' + Math.floor(Math.random() * 1000000)
	window[rand] = {}
	
	// func called from android
	window[rand].callback = (isSuccess) => {
        const dataOrErr = Android.runAsyncResult(rand)
		if (isSuccess) window[rand].resolve(dataOrErr)
		else window[rand].reject(dataOrErr)
		delete window[rand] // clean up
	}
	
	// call some android function that returns immediately - should run in a new thread 
	// setTimeout(() => window[rand].callback(false, params.val * 2), 4000) // see testCallJavaAsync
	Android.runAsync(rand, javaFuncName, JSON.stringify(params))

	return new Promise((resolve, reject) => {
		window[rand].resolve = (data) => resolve(data)
		window[rand].reject = (err) => reject(err)
	})
}

// async function testCallJavaAsync() {
// 	const res = await callJavaAsync('testFunc', { val: 100 })
// 	console.log(`received res = ${res}`)
// }
// testCallJavaAsync()