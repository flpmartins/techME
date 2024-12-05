import { useState } from 'react'
import question from './assets/question.svg'
import { ItemSuggestion } from './components/ItemSuggestion'
import { getHistoric, setHistoric } from './storage/historic'
import { Message, sendMessage } from './api/openai'
import { ThreeDots } from 'react-loader-spinner'

type ProgressType = 'pending' | 'started' | 'done'
function App() {
  const [progress, setProgress] = useState<ProgressType>('pending')
  const [textarea, setTextarea] = useState('')
  const [chat, setChat] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmitChat() {
    if (!textarea) {
      return
    }
    const message = textarea

    setTextarea('')

    const prompt = `gere uma pergunta onde simule uma entrevista de 
    emprego sobre ${message}, após gerar a pergunta, 
    enviarei a resposta e você me dará um feedback. 
    O feedback precisa ser simples e objetivo e corresponder fielmente a resposta enviada.
    Após o feedback não existirá mais interação.`

    if (progress === 'pending') {
      setHistoric(message)
      setProgress('started')
      const messageUser: Message = {
        role: 'user',
        content: prompt,
        subject: message
      }


      setChat(text => [...text, messageUser])
      setLoading(true)
      const questionGPT = await sendMessage([messageUser])
      setChat(text => [...text, { role: 'assistant', content: questionGPT.content }])
      return setLoading(false)
    }

    const responseUser: Message = {
      role: 'user',
      content: message,
    }

    setChat(text => [...text, responseUser])
    setLoading(true)

    const feedbackGPT = await sendMessage([...chat, responseUser])


    setChat(text => [...text, { role: 'assistant', content: feedbackGPT.content }])
    setLoading(false)
    setProgress('done')
  }

  function resetChat() {
    setProgress('pending')
    setChat([])
  }

  return (
    <div className="container">
      <div className="sidebar">
        <details open className="details_topics">
          <summary className="details_topics_title">Tópicos Sugeridos</summary>
          <div className="details_content">
            <ItemSuggestion title='HTML' onClick={() => setTextarea('HTML')} />
            <ItemSuggestion title='CSS' onClick={() => setTextarea('CSS')} />
            <ItemSuggestion title='JAVSCRIPT' onClick={() => setTextarea('JAVASCRPT')} />
            <ItemSuggestion title='TYPESCRIPT' onClick={() => setTextarea('TYPESCRIPT')} />
          </div>
        </details>
        <details open className="details_history_title">
          <summary className="details_history_title">Histórico</summary>
          <div className="details_content">
            {getHistoric().map(item => (
              <ItemSuggestion title={item} onClick={() => setTextarea(item)} />
            ))
            }
          </div>
        </details>
      </div>
      <div className="content">
        <div className="content_wrapper">
          {progress !== 'pending' && (
            <>
              {chat[0] && (
                <div className="content_wrapper_title_response">
                  <h1>Você está estudando sobre <span>{chat[0]?.subject}</span></h1>
                </div>
              )}
              {chat[1] && (
                <div className="content_wrapper_question">
                  <h2><img src={question} /> Pergunta</h2>
                  <p>
                    {chat[1].content}</p>
                </div>
              )}
              {chat[2] && (
                <div className="content_wrapper_answer">
                  <h2>Sua Resposta</h2>
                  <p>
                    {chat[2].content}
                  </p>
                </div>
              )}
              {chat[3] && (
                <div className="content_wrapper_feedback">
                  <h2>Feedback teach<span>.me</span></h2>
                  <p>
                    {chat[3].content}
                  </p>
                  <div className="actions">
                    <button onClick={resetChat}>Estudar Novo Topico</button>
                  </div>
                </div>
              )}
            </>
          )}
          {progress === 'pending' && (
            <>
              <div className="content_wrapper_result">
                <span className="content_wrapper_result_title">Olá eu sou o</span>
                <div className="content_wrapper_result_title_emphasis">
                  <h1 className="content_wrapper_result_title_tech">Tech</h1>
                  <h1 className="content_wrapper_result_title_me">.me</h1>
                </div>
                <p className="content_wrapper_result_paragraph">Estou aqui para te ajudar nos seus estudos.   </p>
                <p className="content_wrapper_result_paragraph">
                  Selecione um dos Tópicos
                  sugeridos ao lado ou digite um Tópico que deseja para começarmos.
                </p>
              </div>
            </>
          )}
          {loading &&
            <ThreeDots
              visible={true}
              width="60"
              height="30"
              color='#d6409f'
              radius="9"
              ariaLabel='three-dots-loading'
              wrapperStyle={{
                margin: '30px auto'
              }}
            />
          }

          {progress !== 'done' && (
            <div className="content_wrapper_form">
              <textarea
                value={textarea}
                onChange={
                  (element) => setTextarea(element.target.value)
                }
                placeholder={
                  progress === 'started' ? "insira sua resposta" : "insira o tema que você deseja estudar"
                }
              ></textarea>
              <button title='Enviar Pergunta' className="content_wrapper_form_button" onClick={handleSubmitChat}>{progress === 'pending' ? 'Enviar Pergunta' : 'Enviar Resposta'}</button>
            </div>
          )}

          <div className="footer">
            <h1 className="content_wrapper_result_title_tech">Tech</h1>
            <h1 className="content_wrapper_result_title_me">.me</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
