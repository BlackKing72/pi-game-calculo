<div align="center">
	<a href="https://github.com/BlackKing72/api-owlpost"  style="filter: drop-shadow(0 0 1px #fafaff80)">
		<img src="https://github.com/user-attachments/assets/01d26aab-c892-4874-8807-ee0ba04e5b1e" alt="Logo" width="100" height="100">
    </a>
	<h3 align="center">Owlcalc</h3>
	<p align="center">
		Um minigame educativo desenvolvido para estudantes de enfermagem.
	</p>
</div>
<br/>

<div align="center">
	<img src="https://github.com/user-attachments/assets/0ded3d58-74d3-4d52-a25e-c3c9c1c909f7" width="150" alt="O menu principal do jogo."/>
    &nbsp
    <img src="https://github.com/user-attachments/assets/fddfbbe6-3e03-47ad-98a6-d636a95854fc" width="150" alt="Um minigame de organizar as respostas na ordem correta"/>
    &nbsp
    <img src="https://github.com/user-attachments/assets/abd4343e-9f5a-43d6-895b-de999d15c239" width="150" alt="Um minigame em formato de quiz"/>
    &nbsp
    <img src="https://github.com/user-attachments/assets/6bd7cd1f-3865-4603-9b7a-05ec4707559b" width="150" alt="A tela de resultados após o final do jogo"/>
</div>
		

<!-- [OwlCalc 2x.webm](https://github.com/user-attachments/assets/f0aba7e3-e1ff-4a18-8829-a314ed20ee57) -->


<br/>
<br/>

O Objetivo do app é ajudar os estudantes de enfermagem a resolver cálculos de medicamentos e gotejamento de soro, tudo de forma interativa e prática.

Foi criado usando [React][react-url] + [Vite][vite-url] e algumas bibliotecas para facilitar o desenvolvimento.

Este projeto foi criado como parte de um trabalho escolar, [Projeto Integrador (P.I)](#sobre-o-projeto-integrador), com o objetivo de demonstrar habilidades adquiridas no decorrer das unidades curriculares.

<br/>
<div align="center">
	<video src="https://github.com/user-attachments/assets/f0aba7e3-e1ff-4a18-8829-a314ed20ee57" controls="controls" style="max-width: 200px;" alt="A tela de resultados após o final do jogo">
</div>
<br/>

<br/>

## Como funciona

O app conduz o estudante passo a passo na resolução dos cálculos, até a solução final.

Os cálculos são divididos em etapas. Em cada etapa você precisa organizar os componentes da fórmula na ordem correta.

<br/>

## Tecnologias utilizadas

[![React][react-shield]][react-url]
[![Vite][vite-shield]][vite-url]
[![TypeScript][ts-shield]][ts-url]  
[![Shadcn/ui][shadcn-shield]][shadcn-url]
[![Axios][axios-shield]][axios-url]
[![Swapy][swapy-shield]][swapy-url]

<br/>

## Melhorias futuras

- Simplificar o passo a passo para tornar o jogo mais simples e dinâmico.
- Corrigir bugs no drag and drop que prejudicam a experiência do usuário.
- Adicionar mais efeitos visuais e sonoros.
- Melhorar o feedback de algumas ações do usuário.
- Adicionar configurações de ambiente.
- Refinar a experiência no geral.

<br/>

## Autores

[![Matheus Senna][matheus-shield]][matheus-url]
[![Michaell Senna][michaell-shield]][michaell-url]
[![Jonatas Tavares][jonatas-shield]][jonatas-url]

<br/>

## Como rodar o projeto

1. Clone o repositório:
```sh
git clone https://github.com/BlackKing72/owlcalc/
```

2. Acesse a pasta do projeto:
```sh
cd owlcalc
```

3. Instale as dependências:
```sh
npm install
```

5. Inicie o servidor:
```sh
npm run dev
```

<br/>

## Sobre o Projeto Integrador

O P.I tem como objetivo resolver problemas reais utilizando habilidades adquiridas durante as unidades curriculares, incluindo hardware, redes de computadores e desenvolvimento de software.

O nosso projeto foi baseado em um desafio enfrentado pelas turmas de enfermagem, conteúdos teóricos que tornavam o aprendizado difícil e pouco interativo.

Nossa solução foi divida em duas partes:

### Owlpost

Como as turmas de enfermagem já tinham o costume de compartilharem conteúdos entre si, pensamos em algo que poderia facilitar isso. Uma plataforma colaborativa onde os estudantes podem compartilhar conteúdos relacionados às suas matérias e outros tópicos de interesse da turma.

### Owlcalc

Uma das maiores demandas das turmas de enfermagem. Um minigame educativo para ajudar os estudantes de enfermagem à resolverem os cálculos de medicamento e gotejamento de soro de forma prática e interativa.



[react-shield]: https://img.shields.io/badge/React-404040?style=for-the-badge&logo=react
[react-url]: https://react.dev/

[vite-shield]: https://img.shields.io/badge/Vite-404040?style=for-the-badge&logo=vite
[vite-url]: https://vite.dev/

[ts-shield]: https://img.shields.io/badge/TypeScript-404040?style=for-the-badge&logo=typescript
[ts-url]: https://www.typescriptlang.org/

[shadcn-shield]: https://img.shields.io/badge/Shadcn/ui-404040?style=for-the-badge&logo=shadcnui
[shadcn-url]: https://ui.shadcn.com/

[axios-shield]: https://img.shields.io/badge/Axios-404040?style=for-the-badge&logo=axios
[axios-url]: https://axios-http.com/

[swapy-shield]: https://img.shields.io/badge/Swapy-404040?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyBjbGFzcz0idy1mdWxsIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxOSIgeT0iMjciIHdpZHRoPSIzODEuMTYzIiBoZWlnaHQ9IjM4MS4xNjMiIHJ4PSI4MCIgZmlsbD0iIzE5Mzc0RCIvPjxyZWN0IHg9IjExMS43MTUiIHk9IjEwMi45NzUiIHdpZHRoPSIzODEuMTYzIiBoZWlnaHQ9IjM4MS4xNjMiIHJ4PSI4MCIgZmlsbD0iIzNBODFCNCIvPjwvc3ZnPg%3D%3D
[swapy-url]: https://swapy.tahazsh.com/

[jonatas-shield]: https://img.shields.io/badge/Jonatas_Tavares-404040?style=for-the-badge&logo=github
[jonatas-url]: https://github.com/JonatasTavares2000

[matheus-shield]: https://img.shields.io/badge/Matheus_Cruz-404040?style=for-the-badge&logo=github
[matheus-url]: https://github.com/BlackKing72

[michaell-shield]: https://img.shields.io/badge/Michaell_Senna-404040?style=for-the-badge&logo=github
[michaell-url]: https://github.com/thug-okami
