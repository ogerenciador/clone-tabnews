function status(request, response){
  response.status(200).json("Alunos do curso.dev são acima da média")
/*json({"chave":"Alunos do curso.dev são acima da média"})*/
}
export default status;