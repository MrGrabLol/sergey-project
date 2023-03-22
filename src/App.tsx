import React, {useEffect, useState} from 'react';
import './App.css';
import axios, {AxiosError} from "axios";
import FileSaver from 'file-saver'

interface IImageResponse {
    prompt: string,
    resolution: string,
    url: string
}

function App() {
    const [input, setInput] = useState<string>('')
    const [sizeInput, setSizeInput] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [fetchError, setFetchError] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [urlResponse, setUrlResponse] = useState<IImageResponse>({prompt: '', resolution: '', url: ''})
    const [urlContainer, setUrlContainer] = useState<IImageResponse[]>([])

    async function sendRequest() {
        setError('')
        setLoading(true)
        try {
            const response = await axios.post('http://51.250.31.210:9090/image', {
                prompt: input,
                size: sizeInput,
                amount: 1
            })
            setUrlResponse(response.data)
            setUrlContainer([...urlContainer, response.data])
            setLoading(false)
        } catch (e: unknown) {
            setLoading(false)
            const error = e as AxiosError
            setError(error.message)
        }
    }

    async function getRequest() {
        try {
            const response = await axios.get('http://51.250.31.210:9090/image')
            setUrlContainer(response.data)
        } catch (e: unknown) {
            const error = e as AxiosError
            setFetchError(error.message)
        }
    }

    useEffect(() => {
        getRequest()
    }, [])

    const handleClick = () => {
        FileSaver.saveAs(urlResponse.url, 'image.png')
    }

    return (
        <div className="App">
            <div className='container'>
                <div className='input-container'>
                    <input type="text" value={input} onChange={event => setInput(event.target.value)}/>
                    <div className='resolution-switch'>
                        <span className='switch-btn' id='span-one' onClick={() => {
                            setSizeInput('256x256')
                            document.getElementById('span-one')!.classList.add('active')
                            // document.getElementById('span-two')!.classList.add('check')
                            document.getElementById('span-two')!.classList.remove('active')
                            document.getElementById('span-three')!.classList.remove('active')
                        }}>256x256</span>
                        <span className='switch-btn check' id='span-two' onClick={() => {
                            setSizeInput('512x512')
                            document.getElementById('span-one')!.classList.remove('active')
                            document.getElementById('span-two')!.classList.add('active')
                            // document.getElementById('span-two')!.classList.remove('check')
                            document.getElementById('span-three')!.classList.remove('active')
                        }}>512x512</span>
                        <span className='switch-btn' id='span-three' onClick={() => {
                            setSizeInput('1024x1024')
                            document.getElementById('span-one')!.classList.remove('active')
                            document.getElementById('span-two')!.classList.remove('active')
                            // document.getElementById('span-two')!.classList.add('check')
                            document.getElementById('span-three')!.classList.add('active')
                        }}>1024x1024</span>
                    </div>
                    <button disabled={input === '' || sizeInput === ''} onClick={sendRequest}>Сгенирировать</button>
                </div>
                {error && <h2 style={{color: 'red'}}>{error}</h2>}
                <div className='picture-text-container'>
                    {
                        loading &&
                        <div className='loader-container'>
                            <div className="lds-grid">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    }
                    {
                        !loading && !error && urlResponse.url !== '' &&
                        <div className='picture'>
                            <img className='picture' src={urlResponse.url} alt='generated'/>
                        </div>
                    }
                    {
                        !loading && !error && urlResponse.url !== '' &&
                        <div className='text'>
                            <h2>{urlResponse.prompt}</h2>
                            <h4>{urlResponse.resolution}</h4>
                            <button onClick={handleClick}>Открыть</button>
                        </div>
                    }
                </div>
                {
                    !fetchError &&
                    <div className='picture-grid-container'>
                        <div className='picture-grid'>
                            {urlContainer.map((image, index) => <div className='img-wrap'>
                                <img src={image.url} alt='saved' key={index}/>
                                <div className='img-prompt'>
                                    <h2>{image.prompt}</h2>
                                    <h2>{image.resolution}</h2>
                                </div>
                            </div>)}
                        </div>
                    </div>
                }
                {
                    fetchError && <h2 style={{color: 'red'}}>{fetchError}</h2>
                }
            </div>
        </div>
    );
}

export default App;
