/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/_common/frame-processor.js":
/*!*****************************************!*\
  !*** ./dist/_common/frame-processor.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n/*\nSome of this code, together with the default options found in index.ts,\nwere taken (or took inspiration) from https://github.com/snakers4/silero-vad\n*/\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.FrameProcessor = exports.validateOptions = exports.defaultFrameProcessorOptions = void 0;\nconst messages_1 = __webpack_require__(/*! ./messages */ \"./dist/_common/messages.js\");\nconst logging_1 = __webpack_require__(/*! ./logging */ \"./dist/_common/logging.js\");\nconst RECOMMENDED_FRAME_SAMPLES = [512, 1024, 1536];\nexports.defaultFrameProcessorOptions = {\n    positiveSpeechThreshold: 0.5,\n    negativeSpeechThreshold: 0.5 - 0.15,\n    preSpeechPadFrames: 1,\n    redemptionFrames: 8,\n    frameSamples: 1536,\n    minSpeechFrames: 3,\n    submitUserSpeechOnPause: false,\n};\nfunction validateOptions(options) {\n    if (!RECOMMENDED_FRAME_SAMPLES.includes(options.frameSamples)) {\n        logging_1.log.warn(\"You are using an unusual frame size\");\n    }\n    if (options.positiveSpeechThreshold < 0 ||\n        options.negativeSpeechThreshold > 1) {\n        logging_1.log.error(\"postiveSpeechThreshold should be a number between 0 and 1\");\n    }\n    if (options.negativeSpeechThreshold < 0 ||\n        options.negativeSpeechThreshold > options.positiveSpeechThreshold) {\n        logging_1.log.error(\"negativeSpeechThreshold should be between 0 and postiveSpeechThreshold\");\n    }\n    if (options.preSpeechPadFrames < 0) {\n        logging_1.log.error(\"preSpeechPadFrames should be positive\");\n    }\n    if (options.redemptionFrames < 0) {\n        logging_1.log.error(\"preSpeechPadFrames should be positive\");\n    }\n}\nexports.validateOptions = validateOptions;\nconst concatArrays = (arrays) => {\n    const sizes = arrays.reduce((out, next) => {\n        out.push(out.at(-1) + next.length);\n        return out;\n    }, [0]);\n    const outArray = new Float32Array(sizes.at(-1));\n    arrays.forEach((arr, index) => {\n        const place = sizes[index];\n        outArray.set(arr, place);\n    });\n    return outArray;\n};\nclass FrameProcessor {\n    constructor(modelProcessFunc, modelResetFunc, options) {\n        this.modelProcessFunc = modelProcessFunc;\n        this.modelResetFunc = modelResetFunc;\n        this.options = options;\n        this.speaking = false;\n        this.redemptionCounter = 0;\n        this.active = false;\n        this.reset = () => {\n            this.speaking = false;\n            this.audioBuffer = [];\n            this.modelResetFunc();\n            this.redemptionCounter = 0;\n        };\n        this.pause = () => {\n            this.active = false;\n            if (this.options.submitUserSpeechOnPause) {\n                return this.endSegment();\n            }\n            else {\n                this.reset();\n                return {};\n            }\n        };\n        this.resume = () => {\n            this.active = true;\n        };\n        this.endSegment = () => {\n            const audioBuffer = this.audioBuffer;\n            this.audioBuffer = [];\n            const speaking = this.speaking;\n            this.reset();\n            const speechFrameCount = audioBuffer.reduce((acc, item) => {\n                return acc + +item.isSpeech;\n            }, 0);\n            if (speaking) {\n                if (speechFrameCount >= this.options.minSpeechFrames) {\n                    const audio = concatArrays(audioBuffer.map((item) => item.frame));\n                    return { msg: messages_1.Message.SpeechEnd, audio };\n                }\n                else {\n                    return { msg: messages_1.Message.VADMisfire };\n                }\n            }\n            return {};\n        };\n        this.process = async (frame) => {\n            if (!this.active) {\n                return {};\n            }\n            const probs = await this.modelProcessFunc(frame);\n            this.audioBuffer.push({\n                frame,\n                isSpeech: probs.isSpeech >= this.options.positiveSpeechThreshold,\n            });\n            if (probs.isSpeech >= this.options.positiveSpeechThreshold &&\n                this.redemptionCounter) {\n                this.redemptionCounter = 0;\n            }\n            if (probs.isSpeech >= this.options.positiveSpeechThreshold &&\n                !this.speaking) {\n                this.speaking = true;\n                return { probs, msg: messages_1.Message.SpeechStart };\n            }\n            if (probs.isSpeech < this.options.negativeSpeechThreshold &&\n                this.speaking &&\n                ++this.redemptionCounter >= this.options.redemptionFrames) {\n                this.redemptionCounter = 0;\n                this.speaking = false;\n                const audioBuffer = this.audioBuffer;\n                this.audioBuffer = [];\n                const speechFrameCount = audioBuffer.reduce((acc, item) => {\n                    return acc + +item.isSpeech;\n                }, 0);\n                if (speechFrameCount >= this.options.minSpeechFrames) {\n                    const audio = concatArrays(audioBuffer.map((item) => item.frame));\n                    return { probs, msg: messages_1.Message.SpeechEnd, audio };\n                }\n                else {\n                    return { probs, msg: messages_1.Message.VADMisfire };\n                }\n            }\n            if (!this.speaking) {\n                while (this.audioBuffer.length > this.options.preSpeechPadFrames) {\n                    this.audioBuffer.shift();\n                }\n            }\n            return { probs };\n        };\n        this.audioBuffer = [];\n        this.reset();\n    }\n}\nexports.FrameProcessor = FrameProcessor;\n//# sourceMappingURL=frame-processor.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/frame-processor.js?");

/***/ }),

/***/ "./dist/_common/index.js":
/*!*******************************!*\
  !*** ./dist/_common/index.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __exportStar = (this && this.__exportStar) || function(m, exports) {\n    for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.utils = void 0;\nconst _utils = __importStar(__webpack_require__(/*! ./utils */ \"./dist/_common/utils.js\"));\nexports.utils = {\n    minFramesForTargetMS: _utils.minFramesForTargetMS,\n    arrayBufferToBase64: _utils.arrayBufferToBase64,\n    encodeWAV: _utils.encodeWAV,\n};\n__exportStar(__webpack_require__(/*! ./non-real-time-vad */ \"./dist/_common/non-real-time-vad.js\"), exports);\n__exportStar(__webpack_require__(/*! ./frame-processor */ \"./dist/_common/frame-processor.js\"), exports);\n__exportStar(__webpack_require__(/*! ./messages */ \"./dist/_common/messages.js\"), exports);\n__exportStar(__webpack_require__(/*! ./logging */ \"./dist/_common/logging.js\"), exports);\n__exportStar(__webpack_require__(/*! ./models */ \"./dist/_common/models.js\"), exports);\n__exportStar(__webpack_require__(/*! ./resampler */ \"./dist/_common/resampler.js\"), exports);\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/index.js?");

/***/ }),

/***/ "./dist/_common/logging.js":
/*!*********************************!*\
  !*** ./dist/_common/logging.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.log = exports.LOG_PREFIX = void 0;\nexports.LOG_PREFIX = \"[VAD]\";\nconst levels = [\"error\", \"debug\", \"warn\"];\nfunction getLog(level) {\n    return (...args) => {\n        console[level](exports.LOG_PREFIX, ...args);\n    };\n}\nconst _log = levels.reduce((acc, level) => {\n    acc[level] = getLog(level);\n    return acc;\n}, {});\nexports.log = _log;\n//# sourceMappingURL=logging.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/logging.js?");

/***/ }),

/***/ "./dist/_common/messages.js":
/*!**********************************!*\
  !*** ./dist/_common/messages.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Message = void 0;\nvar Message;\n(function (Message) {\n    Message[\"AudioFrame\"] = \"AUDIO_FRAME\";\n    Message[\"SpeechStart\"] = \"SPEECH_START\";\n    Message[\"VADMisfire\"] = \"VAD_MISFIRE\";\n    Message[\"SpeechEnd\"] = \"SPEECH_END\";\n    Message[\"SpeechStop\"] = \"SPEECH_STOP\";\n})(Message || (exports.Message = Message = {}));\n//# sourceMappingURL=messages.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/messages.js?");

/***/ }),

/***/ "./dist/_common/models.js":
/*!********************************!*\
  !*** ./dist/_common/models.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nvar _a;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Silero = void 0;\n// @ts-ignore\nconst logging_1 = __webpack_require__(/*! ./logging */ \"./dist/_common/logging.js\");\nclass Silero {\n    constructor(ort, modelFetcher) {\n        this.ort = ort;\n        this.modelFetcher = modelFetcher;\n        this.init = async () => {\n            logging_1.log.debug(\"initializing vad\");\n            const modelArrayBuffer = await this.modelFetcher();\n            this._session = await this.ort.InferenceSession.create(modelArrayBuffer);\n            this._sr = new this.ort.Tensor(\"int64\", [16000n]);\n            this.reset_state();\n            logging_1.log.debug(\"vad is initialized\");\n        };\n        this.reset_state = () => {\n            const zeroes = Array(2 * 64).fill(0);\n            this._h = new this.ort.Tensor(\"float32\", zeroes, [2, 1, 64]);\n            this._c = new this.ort.Tensor(\"float32\", zeroes, [2, 1, 64]);\n        };\n        this.process = async (audioFrame) => {\n            const t = new this.ort.Tensor(\"float32\", audioFrame, [1, audioFrame.length]);\n            const inputs = {\n                input: t,\n                h: this._h,\n                c: this._c,\n                sr: this._sr,\n            };\n            const out = await this._session.run(inputs);\n            this._h = out.hn;\n            this._c = out.cn;\n            const [isSpeech] = out.output.data;\n            const notSpeech = 1 - isSpeech;\n            return { notSpeech, isSpeech };\n        };\n    }\n}\nexports.Silero = Silero;\n_a = Silero;\nSilero.new = async (ort, modelFetcher) => {\n    const model = new _a(ort, modelFetcher);\n    await model.init();\n    return model;\n};\n//# sourceMappingURL=models.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/models.js?");

/***/ }),

/***/ "./dist/_common/non-real-time-vad.js":
/*!*******************************************!*\
  !*** ./dist/_common/non-real-time-vad.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PlatformAgnosticNonRealTimeVAD = exports.defaultNonRealTimeVADOptions = void 0;\nconst frame_processor_1 = __webpack_require__(/*! ./frame-processor */ \"./dist/_common/frame-processor.js\");\nconst messages_1 = __webpack_require__(/*! ./messages */ \"./dist/_common/messages.js\");\nconst models_1 = __webpack_require__(/*! ./models */ \"./dist/_common/models.js\");\nconst resampler_1 = __webpack_require__(/*! ./resampler */ \"./dist/_common/resampler.js\");\nexports.defaultNonRealTimeVADOptions = {\n    ...frame_processor_1.defaultFrameProcessorOptions,\n    ortConfig: undefined\n};\nclass PlatformAgnosticNonRealTimeVAD {\n    static async _new(modelFetcher, ort, options = {}) {\n        const fullOptions = {\n            ...exports.defaultNonRealTimeVADOptions,\n            ...options,\n        };\n        if (fullOptions.ortConfig !== undefined) {\n            fullOptions.ortConfig(ort);\n        }\n        const vad = new this(modelFetcher, ort, fullOptions);\n        await vad.init();\n        return vad;\n    }\n    constructor(modelFetcher, ort, options) {\n        this.modelFetcher = modelFetcher;\n        this.ort = ort;\n        this.options = options;\n        this.init = async () => {\n            const model = await models_1.Silero.new(this.ort, this.modelFetcher);\n            this.frameProcessor = new frame_processor_1.FrameProcessor(model.process, model.reset_state, {\n                frameSamples: this.options.frameSamples,\n                positiveSpeechThreshold: this.options.positiveSpeechThreshold,\n                negativeSpeechThreshold: this.options.negativeSpeechThreshold,\n                redemptionFrames: this.options.redemptionFrames,\n                preSpeechPadFrames: this.options.preSpeechPadFrames,\n                minSpeechFrames: this.options.minSpeechFrames,\n                submitUserSpeechOnPause: this.options.submitUserSpeechOnPause,\n            });\n            this.frameProcessor.resume();\n        };\n        this.run = async function* (inputAudio, sampleRate) {\n            const resamplerOptions = {\n                nativeSampleRate: sampleRate,\n                targetSampleRate: 16000,\n                targetFrameSize: this.options.frameSamples,\n            };\n            const resampler = new resampler_1.Resampler(resamplerOptions);\n            const frames = resampler.process(inputAudio);\n            let start, end;\n            for (const i of [...Array(frames.length)].keys()) {\n                const f = frames[i];\n                const { msg, audio } = await this.frameProcessor.process(f);\n                switch (msg) {\n                    case messages_1.Message.SpeechStart:\n                        start = (i * this.options.frameSamples) / 16;\n                        break;\n                    case messages_1.Message.SpeechEnd:\n                        end = ((i + 1) * this.options.frameSamples) / 16;\n                        // @ts-ignore\n                        yield { audio, start, end };\n                        break;\n                    default:\n                        break;\n                }\n            }\n            const { msg, audio } = this.frameProcessor.endSegment();\n            if (msg == messages_1.Message.SpeechEnd) {\n                yield {\n                    audio,\n                    // @ts-ignore\n                    start,\n                    end: (frames.length * this.options.frameSamples) / 16,\n                };\n            }\n        };\n        (0, frame_processor_1.validateOptions)(options);\n    }\n}\nexports.PlatformAgnosticNonRealTimeVAD = PlatformAgnosticNonRealTimeVAD;\n//# sourceMappingURL=non-real-time-vad.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/non-real-time-vad.js?");

/***/ }),

/***/ "./dist/_common/resampler.js":
/*!***********************************!*\
  !*** ./dist/_common/resampler.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Resampler = void 0;\nconst logging_1 = __webpack_require__(/*! ./logging */ \"./dist/_common/logging.js\");\nclass Resampler {\n    constructor(options) {\n        this.options = options;\n        this.process = (audioFrame) => {\n            const outputFrames = [];\n            for (const sample of audioFrame) {\n                this.inputBuffer.push(sample);\n            }\n            while ((this.inputBuffer.length * this.options.targetSampleRate) /\n                this.options.nativeSampleRate >\n                this.options.targetFrameSize) {\n                const outputFrame = new Float32Array(this.options.targetFrameSize);\n                let outputIndex = 0;\n                let inputIndex = 0;\n                while (outputIndex < this.options.targetFrameSize) {\n                    let sum = 0;\n                    let num = 0;\n                    while (inputIndex <\n                        Math.min(this.inputBuffer.length, ((outputIndex + 1) * this.options.nativeSampleRate) /\n                            this.options.targetSampleRate)) {\n                        sum += this.inputBuffer[inputIndex];\n                        num++;\n                        inputIndex++;\n                    }\n                    outputFrame[outputIndex] = sum / num;\n                    outputIndex++;\n                }\n                this.inputBuffer = this.inputBuffer.slice(inputIndex);\n                outputFrames.push(outputFrame);\n            }\n            return outputFrames;\n        };\n        if (options.nativeSampleRate < 16000) {\n            logging_1.log.error(\"nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate\");\n        }\n        this.inputBuffer = [];\n    }\n}\nexports.Resampler = Resampler;\n//# sourceMappingURL=resampler.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/resampler.js?");

/***/ }),

/***/ "./dist/_common/utils.js":
/*!*******************************!*\
  !*** ./dist/_common/utils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.encodeWAV = exports.arrayBufferToBase64 = exports.minFramesForTargetMS = void 0;\nfunction minFramesForTargetMS(targetDuration, frameSamples, sr = 16000) {\n    return Math.ceil((targetDuration * sr) / 1000 / frameSamples);\n}\nexports.minFramesForTargetMS = minFramesForTargetMS;\nfunction arrayBufferToBase64(buffer) {\n    var binary = \"\";\n    var bytes = new Uint8Array(buffer);\n    var len = bytes.byteLength;\n    for (var i = 0; i < len; i++) {\n        binary += String.fromCharCode(bytes[i]);\n    }\n    return btoa(binary);\n}\nexports.arrayBufferToBase64 = arrayBufferToBase64;\n/*\nThis rest of this was mostly copied from https://github.com/linto-ai/WebVoiceSDK\n*/\nfunction encodeWAV(samples, format = 3, sampleRate = 16000, numChannels = 1, bitDepth = 32) {\n    var bytesPerSample = bitDepth / 8;\n    var blockAlign = numChannels * bytesPerSample;\n    var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);\n    var view = new DataView(buffer);\n    /* RIFF identifier */\n    writeString(view, 0, \"RIFF\");\n    /* RIFF chunk length */\n    view.setUint32(4, 36 + samples.length * bytesPerSample, true);\n    /* RIFF type */\n    writeString(view, 8, \"WAVE\");\n    /* format chunk identifier */\n    writeString(view, 12, \"fmt \");\n    /* format chunk length */\n    view.setUint32(16, 16, true);\n    /* sample format (raw) */\n    view.setUint16(20, format, true);\n    /* channel count */\n    view.setUint16(22, numChannels, true);\n    /* sample rate */\n    view.setUint32(24, sampleRate, true);\n    /* byte rate (sample rate * block align) */\n    view.setUint32(28, sampleRate * blockAlign, true);\n    /* block align (channel count * bytes per sample) */\n    view.setUint16(32, blockAlign, true);\n    /* bits per sample */\n    view.setUint16(34, bitDepth, true);\n    /* data chunk identifier */\n    writeString(view, 36, \"data\");\n    /* data chunk length */\n    view.setUint32(40, samples.length * bytesPerSample, true);\n    if (format === 1) {\n        // Raw PCM\n        floatTo16BitPCM(view, 44, samples);\n    }\n    else {\n        writeFloat32(view, 44, samples);\n    }\n    return buffer;\n}\nexports.encodeWAV = encodeWAV;\nfunction interleave(inputL, inputR) {\n    var length = inputL.length + inputR.length;\n    var result = new Float32Array(length);\n    var index = 0;\n    var inputIndex = 0;\n    while (index < length) {\n        result[index++] = inputL[inputIndex];\n        result[index++] = inputR[inputIndex];\n        inputIndex++;\n    }\n    return result;\n}\nfunction writeFloat32(output, offset, input) {\n    for (var i = 0; i < input.length; i++, offset += 4) {\n        output.setFloat32(offset, input[i], true);\n    }\n}\nfunction floatTo16BitPCM(output, offset, input) {\n    for (var i = 0; i < input.length; i++, offset += 2) {\n        var s = Math.max(-1, Math.min(1, input[i]));\n        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);\n    }\n}\nfunction writeString(view, offset, string) {\n    for (var i = 0; i < string.length; i++) {\n        view.setUint8(offset + i, string.charCodeAt(i));\n    }\n}\n//# sourceMappingURL=utils.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/_common/utils.js?");

/***/ }),

/***/ "./dist/worklet.js":
/*!*************************!*\
  !*** ./dist/worklet.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst _common_1 = __webpack_require__(/*! ./_common */ \"./dist/_common/index.js\");\nclass Processor extends AudioWorkletProcessor {\n    constructor(options) {\n        super();\n        this._initialized = false;\n        this._stopProcessing = false;\n        this.init = async () => {\n            _common_1.log.debug(\"initializing worklet\");\n            this.resampler = new _common_1.Resampler({\n                nativeSampleRate: sampleRate,\n                targetSampleRate: 16000,\n                targetFrameSize: this.options.frameSamples,\n            });\n            this._initialized = true;\n            _common_1.log.debug(\"initialized worklet\");\n        };\n        this.options = options.processorOptions;\n        this.port.onmessage = (ev) => {\n            if (ev.data.message === _common_1.Message.SpeechStop) {\n                this._stopProcessing = true;\n            }\n        };\n        this.init();\n    }\n    process(inputs, outputs, parameters) {\n        if (this._stopProcessing) {\n            return false;\n        }\n        // @ts-ignore\n        const arr = inputs[0][0];\n        if (this._initialized && arr instanceof Float32Array) {\n            const frames = this.resampler.process(arr);\n            for (const frame of frames) {\n                this.port.postMessage({ message: _common_1.Message.AudioFrame, data: frame.buffer }, [frame.buffer]);\n            }\n        }\n        return true;\n    }\n}\nregisterProcessor(\"vad-helper-worklet\", Processor);\n//# sourceMappingURL=worklet.js.map\n\n//# sourceURL=webpack://@ricky0123/vad-web/./dist/worklet.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/worklet.js");
/******/ 	
/******/ })()
;