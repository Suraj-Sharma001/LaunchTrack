export const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api';
export async function request(path, options={}){
 const response=await fetch(`${API}${path}`,{...options,headers:options.body instanceof FormData?options.headers:{'Content-Type':'application/json',...options.headers},cache:'no-store'});
 if(!response.ok){let e;try{e=await response.json()}catch{}throw new Error(e?.error||`Request failed (${response.status})`)}
 if(response.status===204)return null;return response.json();
}
export const api={applications:()=>request('/applications'),analytics:()=>request('/analytics'),resumes:()=>request('/resumes'),create:(data)=>request('/applications',{method:'POST',body:JSON.stringify(data)}),update:(id,data)=>request(`/applications/${id}`,{method:'PATCH',body:JSON.stringify(data)}),remove:(id)=>request(`/applications/${id}`,{method:'DELETE'}),uploadResume:(body)=>request('/resumes',{method:'POST',body}),setDefault:(id)=>request(`/resumes/${id}/default`,{method:'PATCH'}),removeResume:(id)=>request(`/resumes/${id}`,{method:'DELETE'})};
