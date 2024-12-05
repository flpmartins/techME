import OpenAI from "openai";

export type Message = {
  role:'user' | 'assistant',
  content: string;
  subject?: string;
}

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_X_API_KEY,
  dangerouslyAllowBrowser:true
});

export async function sendMessage(messages: Message[]) {
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: messages.map(message => (
			{ role: message.role, content: message.content }
		))
	})

	return {
		role: response.choices[0].message.role,
		content: response.choices[0].message.content || ''
	}
}