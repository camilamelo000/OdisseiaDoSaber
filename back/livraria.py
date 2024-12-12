import sqlite3
import os

# Remove o arquivo Livraria.db se ele existir
os.remove("Livraria.db") if os.path.exists("Livraria.db") else None

# Conecta ao banco de dados
conexao = sqlite3.connect("Livraria.db")
cursor = conexao.cursor()

# Criação da tabela Usuario
sql_usuario = """
CREATE TABLE IF NOT EXISTS Usuario(
IdUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
NomeUsuario TEXT NOT NULL,
Email TEXT NOT NULL,
Senha TEXT NOT NULL
);
"""
cursor.execute(sql_usuario)

# Criação da tabela Livro
sql_livro = '''
CREATE TABLE IF NOT EXISTS Livro(
IdLivro INTEGER PRIMARY KEY AUTOINCREMENT,
Titulo TEXT NOT NULL,
Autor TEXT NOT NULL,
Categoria TEXT NOT NULL,
Descricao TEXT NOT NULL,
Preco DECIMAL(7,2),
StatusLivro TEXT
);
'''
cursor.execute(sql_livro)

# Criação da tabela Comentario
sql_comentario = '''
CREATE TABLE IF NOT EXISTS Comentario(
IdComentario INTEGER PRIMARY KEY AUTOINCREMENT,
IdUsuario INTEGER,
IdLivro INTEGER,
Estrelas INTEGER,
Comentarios TEXT NOT NULL,
FOREIGN KEY(IdUsuario) REFERENCES Usuario(IdUsuario),
FOREIGN KEY(IdLivro) REFERENCES Livro(IdLivro)
);
'''
cursor.execute(sql_comentario)

# Criação da tabela Pedido
sql_pedido = '''
CREATE TABLE IF NOT EXISTS Pedido(
IdPedido INTEGER PRIMARY KEY AUTOINCREMENT,
IdUsuario INTEGER,
ValorPedido DECIMAL(7,2),
StatusPedido TEXT,
FOREIGN KEY(IdUsuario) REFERENCES Usuario(IdUsuario)
);
'''
cursor.execute(sql_pedido)

# Criação da tabela Carrinho
sql_carrinho = '''
CREATE TABLE IF NOT EXISTS Carrinho(
IdCarrinho INTEGER PRIMARY KEY AUTOINCREMENT,
IdPedido INTEGER,
IdLivro INTEGER,
Quantidade INTEGER,
Preco DECIMAL(7,2), 
PrecoTotal DECIMAL(7,2),
FOREIGN KEY(IdPedido) REFERENCES Pedido(IdPedido),
FOREIGN KEY(IdLivro) REFERENCES Livro(IdLivro)
);
'''
cursor.execute(sql_carrinho)

# Trigger de atualização do preço total no carrinho
triger_pedido = '''
CREATE TRIGGER AtualizaPrecoTotal
AFTER UPDATE OF Quantidade, Preco 
ON Carrinho FOR EACH ROW
BEGIN
  UPDATE Carrinho
  SET PrecoTotal = Quantidade * Preco
  WHERE IdCarrinho = NEW.IdCarrinho;
END;
'''
cursor.execute(triger_pedido)

# Confirma as alterações e fecha a conexão
conexao.commit()


categoria = [
    ("Matemática Básica para Aplicações de Engenharia", "Kuldip S. Rattan", "Exatas", "Matemática Básica para Aplicações de Engenharia foi elaborado com o objetivo de atender aos estudantes de graduação que precisam realizar uma imersão para desenvolver e aprimorar seus conhecimentos de matemática.Esta disciplina é vista segundo a perspectiva das aplicações práticas das Engenharias, abordando tópicos básicos como pré-cálculo, trigonometria, equações diferenciais, lineares e quadráticas, vetores bidimensionais, números complexos, senoides, sistemas de equações e matrizes, derivadas e integrais. Os autores também incluíram conteúdos da física referentes às disciplinas de dinâmica, estática e resistência de materiais, entre outros, extremamente úteis aos futuros engenheiros.", 67.50, "Semi-Novo"),
    ("Cálculo: Volume 1", "Francisco Magalhães Gomes", "Exatas", "Nesta 9ª edição, assim como em todas as anteriores, os autores mantêm a tradição de escrever um livro que auxilie os estudantes a descobrir o cálculo – tanto por sua utilidade prática, como por sua surpreendente beleza. O intuito é transmitir ao leitor uma ideia da utilidade do cálculo, assim como promover o desenvolvimento de sua habilidade técnica. Ao mesmo tempo, os autores empenharam-se em valorizar a beleza intrínseca do assunto. Não há dúvida de que Newton experimentou uma sensação de triunfo quando fez suas grandes descobertas.", 78.00, "Semi-Novo"),
    ("Pré-Cálculo: Operações, Equações, Funções E Sequências", "Gelson Iezzi", "Exatas", "Nesta 9ª edição, assim como em todas as anteriores, os autores mantêm a tradição de escrever um livro que auxilie os estudantes a descobrir o cálculo – tanto por sua utilidade prática, como por sua surpreendente beleza. O intuito é transmitir ao leitor uma ideia da utilidade do cálculo, assim como promover o desenvolvimento de sua habilidade técnica. Ao mesmo tempo, os autores empenharam-se em valorizar a beleza intrínseca do assunto. Não há dúvida de que Newton experimentou uma sensação de triunfo quando fez suas grandes descobertas.", 78.50, "Semi-Novo"),
    ("Fundamentos de Matemática Elementar - Volume 1: Conjuntos e Funções", "Gelson Iezzi", "Exatas", "Aborda a introdução ao conceito e os estudos das funções polinomiais de 1º e 2º graus. Os capítulos iniciais (I a IV) são preparatórios para a função da Matemática no ensino médio, mas não devem tomar um tempo excessivo. O capítulo final é muito importante para a continuação do estudo de função inversa. Pode-se aproveitar o desenvolvimento de cada capítulo para revisar cálculo algébrico, principalmente em equações e inequações.", 120.00, "Semi-Novo"),
    ("Química: A Ciência Central", "Theodore L. Brown", "Exatas", "O conteúdo essencial, a exatidão científica, a autoria renomada e a abordagem clara e objetiva são características já conhecidas que fazem desta obra um verdadeiro clássico. Agora, extensivamente revista e atualizada, e com o auxílio de quadros informativos, questões de reflexão que permeiam o livro e novos exercícios, esta edição traz uma abordagem ainda mais dinâmica, uma vez que relaciona os assuntos abordados aos objetivos dos estudantes e os estimula a pensar e agir como um cientista. Indicado para os estudantes de química, física, engenharias e ciências biomédicas, esta obra não é somente um livro de referência, mas sim uma ferramenta central.", 195.00, "Novo"),
    ("Princípios de Química: Questionando a Vida Moderna e o Meio Ambiente", "Peter Atkins", "Exatas", "Princípios de Química: questionando a vida moderna e o meio ambiente, sétima edição, apresenta todos os fundamentos da química de forma clara e precisa, utilizando inúmeras ferramentas pedagógicas. O conteúdo está organizado em 85 tópicos curtos, distribuídos em 11 grupos temáticos. Esta divisão tornou o texto muito flexível e adaptável aos objetivos específicos de cada professor, permitindo a omissão de tópicos ou a ordenação dos conteúdos de acordo com o seu plano de ensino.", 155.00, "Novo"),
    ("Física de Sears & Zemansky: Volume I: Mecânica", "Hugh D. Young", "Exatas", "Desde sua primeira edição, esta tem sido uma obra de referência por causa de sua ênfase nos princípios fundamentais de física e em como aplicá-los. Sua clareza e didática minuciosa, assim como a extensa gama de exercícios e exemplos explicativos, desenvolvem nos alunos habilidades de identificação, estabelecimento, execução e avaliação de problemas.", 90.00, "Novo"),
    ("Física III: Eletromagnetismo: Volume III", "Hugh D. Young", "Exatas", "Desde sua primeira edição, esta tem sido uma obra de referência por causa de sua ênfase nos princípios fundamentais de física e em como aplicá-los. Sua clareza e didática minuciosa, assim como a extensa gama de exercícios e exemplos explicativos, desenvolvem nos alunos habilidades de identificação, estabelecimento, execução e avaliação de problemas.", 100.00, "Novo"),
    ("Ato Administrativo e Procedimento Administrativo", "Romeu Felipe Bacellar Filho", "Direito", "O Direito Administrativo evoluiu – e continua a evoluir – de forma espetacular nas últimas décadas. Continuam a surgir novos temas, a se aprofundar no estudo de temas antigos, a enriquecerem as bibliotecas com a produção científica de novos doutrinadores, que vêm aliando seus conhecimentos aos de doutrinadores de escolas que fizeram a história do Direito Administrativo nacional e estrangeiro. A globalização, a aproximação (no direito comunitário europeu, entre os sistemas de base romanística e da common law), a influência da ciência política e da ciência econômica, os princípios do neoliberalismo, e, paralelamente, o movimento em favor da centralidade da pessoa humana, produziram profundas transformações, algumas até contraditórias, para o âmbito do Direito Administrativo.", 240.50, "Novo"),
    ("Código Civil Comentado: Doutrina e Jurisprudência – Lei n. 10.406, de 10.01.2002", "Ministro Cezar Peluso", "Direito", "Esta obra constitui um importante instrumento para a atuação do operador do Direito, fornecendo apoio indispensável no manejo do Código Civil brasileiro. Em comentários sistematizados e objetivos, autores de reconhecida importância na doutrina civilista brasileira realizam, sob a coordenação do Ministro Cezar Peluso, um exame crítico do Código Civil, artigo por artigo, à luz das mudanças legislativas e do posicionamento mais recente dos principais tribunais do país. A indicação da legislação correlata e a transcrição de trechos de acórdãos pertinentes aos respectivos temas complementam a análise dos dispositivos.", 132.50, "Novo"),
    ("Vade Mecum Saraiva Tradicional - 38ª Edição 2024", "Editora Saraiva", "Direito", "O Vade Mecum Saraiva está de volta ― de cara nova, melhor e ainda mais atualizado! Apresentamos a 38ª edição do renomado Vade Mecum Saraiva, líder absoluto em vendas no mercado jurídico brasileiro por mais de 15 anos. Esta edição chega com formato (18X27), maior gramatura nas folhas e textura suave, garantindo clareza, durabilidade e conforto visual, elementos essenciais para horas de estudo. Fica mais fácil fazer marcações e folhear o Vade sem danificá-lo. Confira por que o Vade Mecum Saraiva é o preferido dos alunos e profissionais de Direito.", 90.00, "Novo"),
    ("Teoria Geral dos Recursos - 1ª Edição", "Ígor Martins da Cunha", "Direito", "A obra “Teoria Geral dos Recursos - 1ª Edição” apresenta uma análise aprofundada dos mecanismos de recursos judiciais no sistema jurídico brasileiro, com uma abordagem prática e teórica. Escrita pelos respeitados professores Rosa Maria de Andrade Nery e Nelson Nery Júnior, ela faz parte da prestigiada coleção Estudos e Pareceres, que explora temas fundamentais para o Direito Privado, Civil e Empresarial. Essa publicação é voltada para profissionais e estudantes que desejam compreender os princípios dos recursos e sua aplicação prática nos tribunais.", 135.00, "Novo"),
    ("Manual de Mediação", "Antonio Carlos Ozório Nunes", "Direito", "A obra contém: Os aspectos legais e jurídicos da mediação à luz do nosso ordenamento jurídico; Teorias gerais sobre a autocomposição e a mediação de conflitos; Análises e a identificação dos interesses no conflito; As ferramentas da comunicação e a comunicação não violenta; Metodologias e ferramentais operacionais ligadas à mediação para buscar os resultados almejados, que se referem à adequada condução das reuniões de mediação e das expectativas de acordos; Dicas para a resolução de conflitos mais complexos: gerar muitas ideias para conseguir uma boa ideia; O procedimento da mediação, com aspectos práticos, métodos e as ferramentas para negociações integradoras.", 88.00, "Novo"),
    ("Direito Civil - Vol. Único", "Carlos E. Elias de Oliveira", "Direito", "É mais fácil fixar conteúdo e desenvolver raciocínio crítico quando entendemos o porquê das coisas. Este livro está repleto de esquemas sistemáticos, gráficos, tabelas, organogramas e árvores genealógicas. Aborda questões de concurso, súmulas, jurisprudência do STF e do STJ e Enunciados das Jornadas de Direito Civil. A obra nasce extremamente atualizada, conforme a mais recente jurisprudência e as últimas inovações legislativas. Os autores explicam a matéria com casos práticos e inúmeros exemplos.", 123.00, "Novo"),
    ("Reforma Tributária Comentada e Comparada: emenda const. 132 de 20 de dezembro de 2023", "Hugo de Brito Machado Segundo", "Direito", "Este livro se propõe a desvendar as camadas da reforma tributária implementada pela EC 132/2023, explorando suas implicações, seus desafios e as oportunidades que ela representa. Em uma análise crítica, buscamos entender não apenas o texto da emenda constitucional, mas também o contexto político, econômico e social no qual essa reforma foi gerada e aprovada, bem como os efeitos ou impactos que ela pode ter, à luz da realidade normativa e jurisprudencial preexistente. Critica-se o IVA-Dual que resultará da reforma, porque terá uma das alíquotas mais altas do mundo, mas essa já é a realidade brasileira, se se somarem IPI, ICMS, ISS, PIS e COFINS.", 74.50, "Novo"),
    ("Execução Trabalhista na Prática", "Rafael Guimarães", "Direito", "A obra que traz o título “Execução Trabalhista na Prática” se traduz não apenas em um livro doutrinário de consulta, mas também, e, sobretudo, num precioso instrumento eminentemente pragmático, focado na solução de quaisquer entraves que permeiam a fase executiva no Processo do Trabalho. A obra foi muito além do campo puramente acadêmico, preocupando-se, preponderantemente, com as problemáticas que surgem no dia a dia nos processos executivos trabalhistas.", 130.00, "Novo"),
    ("Manual de Análise de Dados: Estatística e Machine Learning com Excel, SPSS, Stata, R e Python", "Luiz Paulo Fávero", "Tecnologia", "Cada capítulo está estruturado em uma mesma lógica de apresentação, com o objetivo de contextualizar e integrar teoria e aplicações. Após a introdução dos conceitos pertinentes a cada técnica de modelagem, são utilizadas bases de dados que possibilitam a resolução de exercícios práticos em Excel, SPSS, Stata, R e Python. O livro é destinado a estudantes de graduação, pós-graduação e MBA em áreas de Ciências Exatas, Humanas, Sociais Aplicadas e Biomédicas, assim como a profissionais de empresas e pesquisadores que tenham interesse em se especializar em Data Science, Analytics e Machine Learning.", 192.50, "Novo"),
    ("Python Para Análise de Dados: Tratamento de Dados com Pandas, NumPy & Jupyter", "Wes McKinney", "Tecnologia", "Use o Jupyter Notebook e o shell IPython para computação exploratória. Aprenda recursos básicos e avançados do NumPy. Comece a usar as ferramentas de análise de dados da biblioteca pandas. Use ferramentas flexíveis para carregar, limpar, transformar, mesclar e reformatar dados. Crie visualizações informativas com o matplotlib. Aplique o recurso groupBy do pandas para detalhar e resumir conjuntos de dados. Analise e manipule dados de séries temporais regulares e irregulares. Aprenda a resolver problemas de análise de dados do mundo real com exemplos completos e detalhados.", 70.00, "Novo"),
    ("Princípios, Padrões e Práticas Ágeis em C#", "Robert Martin", "Tecnologia", "Destinado a programadores, gerentes de desenvolvimento de software e analistas de negócios, contém diversos estudos de caso que ilustram os fundamentos do desenvolvimento e do projeto ágil, e mostram a evolução de modelos UML em códigos C# reais. Esta obra fornece uma visão completa sobre os princípios ágeis e as práticas da Programação Extrema; o desenvolvimento baseado em testes; a refatoração com testes de unidade; a programação em pares.", 188.00, "Novo"),
    ("Aprenda Lógica de Programação e Algoritmos com Implementações em Portugol, Scratch, C, Java, C# e Python", "Cláudio Luís Vieira Oliveira", "Tecnologia", "No primeiro capítulo, o leitor irá encontrar os conceitos empregados para a resolução de problemas computacionais usando, para isso, técnicas e ferramentas como fluxograma, Portugol e a Scratch, que é uma linguagem de programação visual que possibilita aprendizado rápido e lúdico. Nos capítulos seguintes serão apresentados os conceitos para o desenvolvimento da solução dos algoritmos criados nas linguagens de programação C, Java, C# e Python. Educadores têm notado que o desenvolvimento de lógica de programação amplia a capacidade de resolver problemas além de aumentar a capacidade de pensar de forma sistematizada e criativa.", 52.50, "Novo"),
    ("JavaScript: O Guia Definitivo", "David Flanagan", "Tecnologia", "Referência completa para programadores, JavaScript: O guia definitivo fornece uma ampla descrição da linguagem JavaScript básica e das APIs JavaScript do lado do cliente definidas pelos navegadores Web. Em sua 6ª edição, cuidadosamente reescrita para estar de acordo com as melhores práticas de desenvolvimento Web atuais, abrange ECMAScript 5 e HTML5 e traz novos capítulos que documentam jQuery e JavaScript do lado do servidor. Recomendado para programadores experientes que desejam aprender a linguagem de programação da Web e para programadores JavaScript que desejam ampliar seus conhecimentos e dominar a linguagem, este é o guia do programador e manual de referência de JavaScript completo e definitivo.", 109.00, "Novo"),
    ("Java para Iniciantes: Crie, Compile e Execute Programas Java Rapidamente", "Herbert Schildt", "Tecnologia", "Aprenda rapidamente os fundamentos da programação Java com Herbert Schildt, autor best-seller de publicações sobre programação. Totalmente atualizado para Java Platform, Standard Edition 8 (Java SE 8), Java para iniciantes, 6ª edição apresenta os aspectos básicos e discute as palavras-chave, a sintaxe e as estruturas que formam a base da linguagem. Também aborda recursos mais avançados, incluindo programação com várias threads, tipos genéricos e Swing, além de descrever alguns dos novos recursos de JAVA SE 8, como expressões lambda e métodos de interface padrão.", 77.50, "Novo"),
    ("Engenharia de Software", "Ian Sommerville", "Tecnologia", "A 10ª edição de Engenharia de software foi extensivamente atualizada para refletir a adoção crescente de métodos ágeis na engenharia de software. Um dos destaques da nova edição é o acréscimo de conteúdo sobre a metodologia do Scrum. A divisão em quatro partes do livro foi significativamente reformulada para acomodar novos capítulos sobre engenharia de resiliência, engenharia de sistemas e sistemas de sistemas. Além disso, capítulos sobre tópicos como confiança, segurança e proteção foram completamente reorganizados. Todas essas mudanças se justificam por compreenderem questões essenciais para a engenharia de software moderna ― gerenciamento da complexidade, integração da agilidade a outros métodos e garantia de que os sistemas sejam seguros e resilientes.", 105.00, "Novo"),
    ("Arquitetura e Organização de Computadores", "William Stallings", "Tecnologia", "Arquitetura e organização de computadores, de William Stallings, além de apresentar as principais mudanças, inovações e melhorias na área de computação por meio de uma abordagem ampla e abrangente da área de arquitetura de computadores, também promove uma profunda reflexão sobre os fundamentos da área, estabelecendo relações com questões contemporâneas de design computacional. Nesta edição, o autor aborda a ampla adoção do funcionamento da GPGPUs em conjunto com as CPUs tradicionais para lidar com as inúmeras aplicações que envolvem grandes conjuntos de dados, processadores multicore, cloud computing, a utilização da tecnologia e organização de memória flash para memória interna e externa, e a tecnologia Direct cache access, desenvolvida pela Intel e por outros fabricantes para proporcionar rendimento melhor que a tradicional abordagem de acesso de memória direta (direct memory access).", 120.50, "Novo"),
    ("Macroeconomia", "Olivier Blanchard", "Economia", "Obra de referência no assunto, este livro apresenta uma visão global e unificada da macroeconomia, auxiliando os estudantes a entenderem as conexões entre os mercados financeiros, de bens de consumo e de trabalho em todo o mundo. Quadros detalhados integrados a esta sétima edição foram atualizados para exemplificar a macroeconomia de hoje, reforçar as lições dos modelos e ensinar os estudantes a empregar suas habilidades analíticas. Organizado em duas partes, o livro possui uma seção central, que foca em mercados de curto, médio e longo prazos, e três extensões principais, que oferecem uma cobertura aprofundada dos assuntos mais relevantes.", 107.00, "Novo"),
    ("Economia Industrial – Fundamentos Teóricos e Práticas no Brasil", "Lia HANSENCLEVER", "Economia", "Economia Industrial apresenta o que há de mais recente sobre os fenômenos observados na dinâmica dos mercados das economias contemporâneas, com ênfase para o campo da economia industrial e da inovação. Aborda conceitos básicos, que introduzem o leitor aos principais temas da área de economia industrial e traz análises empíricas sobre a estrutura dos mercados, as interações estratégicas, o exame da natureza das grandes empresas contemporâneas e as estratégias empresariais. Além disso, os leitores encontrarão informações atualizadas sobre as políticas e regulações do mercado no Brasil.", 131.99, "Novo"),
    ("Economia Internacional: Teoria e Política", "Krugman", "Economia", "A pandemia da covid-19 escancarou para todos nós o alto grau de conexão existente entre o movimento de pessoas, os fluxos de dados e o comércio do mundo inteiro. O choque econômico global dela decorrente forçou os governos a buscarem políticas capazes de impedir a disseminação da doença, ao mesmo tempo em que apoiavam suas economias. Essa experiência oferece muitas lições, mas uma delas é a importância de uma perspectiva internacional para a análise de eventos economicamente significativos em nível mundial. O propósito deste livro é preparar os estudantes com ferramentas intelectuais para entender as consequências econômicas da interdependência global.", 109.00, "Novo"),
    ("Fundamentos de Economia", "Marco Antonio Sandoval de Vasconcellos", "Economia", "Fundamentos de Economia é um livro dirigido a estudantes e profissionais das áreas de Ciências Humanas em geral, que fornece uma visão abrangente das principais questões econômicas de nosso tempo. Trata-se de um livro introdutório de Economia Aplicada, no qual os autores explicam com clareza e concisão conceitos e problemas econômicos fundamentais, de forma que os estudantes possam ter melhor compreensão da realidade econômica. A obra apresenta temas como a evolução da Ciência Econômica.", 55.50, "Novo"),
    ("Mercado Financeiro", "Alexandre ASSAF NETO", "Economia", "Este livro oferece uma visão ampla e moderna dos mercados financeiros e de capitais, abordando o funcionamento de suas instituições e operações financeiras e estudando os principais modelos de avaliação dos ativos negociados e de seus riscos. O autor adota como premissa para o moderno estudo dos mercados financeiros um modelo de desenvolvimento econômico baseado principalmente na participação do setor privado. Procura, em essência, esclarecer as seguintes questões: como funcionam os mercados financeiros; qual sua participação e importância no desenvolvimento da economia e no contexto de seus diversos agentes; como são avaliados os instrumentos financeiros negociados no mercado; como são tomadas as decisões financeiras e estabelecidas as estratégias de investimentos; como utilizar os mercados financeiros e de capitais na gestão de risco.", 105.00, "Novo"),
    ("Contabilidade Básica", "José Carlos Marion", "Economia", "Este é um livro que vai além daqueles destinados ao ensino inicial de Contabilidade. Com metodologia moderna e dinâmica, além de linguagem acessível ao aluno iniciante em Contabilidade, o autor apresenta uma visão conjunta dos relatórios contábeis e introduz a matéria de maneira gradativa, despertando o interesse do estudante na aprendizagem da disciplina. Além de apresentar embasamento legal e tributário para o conteúdo, o autor propõe, ao final de cada capítulo, tarefas práticas que ajudam e estimulam o desenvolvimento fora da sala de aula. Esta edição foi atualizada considerando as Normas Internacionais de Contabilidade (IFRS) por meio dos pronunciamentos do CPC (Comitê de Pronunciamentos Contábeis) e das Resoluções e Normas do CFC (Conselho Federal de Contabilidade). APLICAÇÃO: Todos os cursos de graduação em contabilidade nos primeiros semestres.", 56.50, "Novo"),
    ("Estatística Aplicada a Administração e Economia", "David R. Anderson", "Economia", "A obra Estatística aplicada à administração e economia apresenta uma introdução conceitual da estatística e de suas aplicações. Orientado à análise de dados e de metodologia estatística, o texto oferece uma boa preparação para o estudo de material estatístico. Apresenta didática muito bem estruturada, com exercícios que exigem que os alunos utilizem fórmulas e material do capítulo em situações reais.", 86.50, "Novo"),
    ("Estrutura e Análise de Balanços – Um Enfoque Econômico-financeiro", "Alexandre Assaf Neto", "Economia", "Que envolvem estudos avançados sobre rentabilidade, formulações analíticas de desempenho, viabilidade econômica e financeira de um negócio, estrutura de liquidez e análise dinâmica do capital de giro. A obra trata também das metodologias de apuração do valor econômico agregado – indicador do sucesso empresarial – e de análise de bancos. Inclusive, ao abordar a análise de balanços de empresas comerciais, industriais, serviços e bancos comerciais e múltiplos, permite melhor compreensão da posição atual e das tendências futuras.", 80.50, "Novo"),
    ("Sobotta Atlas de Anatomia Humana", "Friedrich Paulsen", "Medicina", "Sobotta | Atlas de Anatomia Humana, o melhor e mais respeitado clássico da área, chega à sua 25ª edição, mantendo o objetivo primordial de oferecer a fórmula perfeita para o estudo da Anatomia: apresentação dos conceitos mais relevantes, identificação dos detalhes da peça anatômica e explicação dinâmica das correlações anatômicas, dados fundamentais desde o exame inicial até a prática clínica.", 230.00, "Novo"),
    ("Netter Atlas de Anatomia Humana – Abordagem Topográfica Clássica", "Frank H. Netter", "Medicina", "Ilustração anatômica inigualável, de renome mundial e clinicamente relevante. Para todos aqueles que estão aprendendo anatomia, participando de um laboratório de dissecação, compartilhando conhecimento anatômico com pacientes ou atualizando seus conhecimentos anatômicos, o Netter Atlas de Anatomia Humana é o material perfeito. Além de ilustrar cada região do corpo humano com detalhes nítidos e sob uma perspectiva clínica, é o único atlas que enfatiza as relações anatômicas mais importantes. Ilustrado por médicos e elaborado especialmente para médicos, contém mais de 550 ilustrações primorosas e dezenas de imagens radiológicas cuidadosamente selecionadas por anatomistas e educadores especialistas em suas respectivas áreas.", 150.50, "Novo"),
    ("Goldman-Cecil Medicina", "Lee Goldman", "Medicina", "Com acesso a atualizações contínuas, o livro se torna a fonte mais rápida de consulta por conter todas as respostas clínicas confiáveis e mais recentes de que você precisa. Este clássico acompanha você por todas as fases da sua carreira! Quase um século como a melhor referência na área, Goldman-Cecil Medicina ainda fornece: Mais de 400 capítulos escritos por consagrados profissionais; Organização prática e padronizada, com ênfase em referências baseadas em evidências; Conteúdo adaptado à realidade brasileira; Temas atuais, como coronavírus 2 da síndrome respiratória grave e Covid-19.", 200.00, "Novo"),
    ("Medicina Interna de Harrison – 2", "Dennis L. Kasper", "Medicina", "Apresentando os extraordinários avanços ocorridos em todas as áreas da medicina, esta nova edição do Harrison foi amplamente revisada para oferecer uma atualização completa sobre a patogênese das doenças, ensaios clínicos, técnicas de diagnóstico, diretrizes clínicas baseadas em evidências, tratamentos já estabelecidos e métodos recentemente aprovados.", 106.00, "Novo"),
    ("Anatomia Orientada para a Clínica", "Arthur F. Dalley Moore", "Medicina", "Anatomia Orientada para a Clínica oferece aos estudantes da área da saúde a mais consistente e acessível abordagem para o aprendizado da anatomia. Com diversas atualizações e novos assuntos, a nova edição mantém o rigor científico das informações do seu respeitado texto. As atualizações refletem os avanços na aplicação clínica da Anatomia, bem como nas tecnologias de imagem, enfatizando os pontos da disciplina que o estudante precisa dominar. Principais diferenciais Recursos pedagógicos que facilitam o aprendizado, como os boxes de correlações clínicas e resumos dos elementos mais importantes abordados em cada capítulo", 190.90, "Novo"),
    ("Princípios de Anatomia e Fisiologia", "Gerard J. Tortora", "Medicina", "Anatomia e fisiologia podem ser disciplinas bastante desafiadoras. Por isso, a 16ª edição desta obra apresenta as funções do corpo humano de modo ainda mais preciso, didático e ricamente ilustrado, além de explorar as aplicações práticas e relevantes desse conhecimento no dia a dia dos profissionais. Escrito por um importante grupo de docentes, este livro integra a terminologia moderna e os achados mais atuais no campo da anatomia e da fisiologia. Enfatiza, também, a importância da homeostasia por meio de correlações clínicas e discussões sobre desequilíbrios homeostáticos. Para complementar e enriquecer ainda mais o aprendizado, também conta com um atlas resumido do esqueleto e da anatomia de superfície, disponível online, para consulta rápida e eficaz.", 150.00, "Novo"),
    ("Biologia Celular e Molecular", "L. C. Junqueira", "Medicina", "Inteiramente atualizada e reorganizada, mas mantendo o equilíbrio didático que um conteúdo introdutório requer, esta obra apresenta todas as informações necessárias sobre as macromoléculas celulares, como proteínas, DNA e RNA. Além disso, fornece os mecanismos básicos para o funcionamento celular, bem como exemplos clínicos de disfunções celulares. Ilustrações detalhadas e de alta qualidade tornam seu conteúdo ainda mais rico, facilitando a compreensão do leitor sobre os temas abordados.", 85.00, "Novo"), 
    ("Psicologia do Inconsciente", "C.G. Jung", "Psicologia", "Livro básico para um primeiro contato com a psicologia de C.G. Jung. Estabelece as diferenças entre Freud, Adler e Jung através de um caso clínico. Apresenta também sua hipótese do inconsciente pessoal e coletivo.", 53.00, "Novo") 
    ]



cursor.executemany("insert into Livro(Titulo, Autor, Categoria, Descricao, Preco, StatusLivro) values(?, ?, ?, ?, ?, ?)", categoria)
conexao.commit()

comments = [
            (1, 4, 5, "Excelente recurso para iniciantes, bem estruturado e claro."),
            (1, 4, 4, "Ótima abordagem do tema, mas poderia explorar mais alguns exemplos práticos."),
            (4, 7, 4, "Muito completo, mas a linguagem é um pouco densa para quem está começando."),
            (2, 7, 4, "Ótimo conteúdo, mas a organização dos capítulos pode ser melhorada."),
            (2, 3, 3, "Bem escrito e objetivo, mas alguns tópicos exigem mais detalhamento"),
            (2, 4, 4, "Excelente para reforçar o conhecimento, mas faltam exercícios práticos."),
            (3, 1, 3, "Muito bom para estudantes, mas o formato poderia ser mais interativo"),
            (3, 1, 3, "Boa explicação teórica, mas a aplicação prática poderia ser mais destacada."),
            (1, 6, 4, "A obra é bem detalhada, mas os exemplos poderiam ser mais diversos."),
            (1, 14, 5, "Ideal para quem quer se aprofundar, mas exige dedicação."),
            (2, 14, 4, "Aborda bem os conceitos, mas alguns tópicos poderiam ser mais claros."),
            (3, 22, 4, "Muito útil, mas a falta de estudos de caso limita a aplicação prática."),
            (1, 22, 4, "Ótimo livro de referência, mas a escrita pode ser um pouco técnica para novatos.."),
            (1, 2, 4, "Excelente para uma introdução ao tema, mas falta aprofundamento em áreas específicas."),
            (1, 1, 4, "Bom equilíbrio entre teoria e prática, porém alguns capítulos são repetitivos.")  
            ]

cursor.executemany("insert into Comentario(IdUsuario, IdLivro, Estrelas, Comentarios) values(?, ?, ?, ?)", comments)
conexao.commit()



user = [
        ("Maria Darcy", "Mariadarcy@gmail.com", "abcd"),
        ("Juliette Ferreira", "Juju@gmail.com", "1234"),
        ("Gabriel", "Gabrielhx@gmail.com", "ca123"),
        ("Joana Silva", "joanasori@gmail.com", "abcd1")
        ]

cursor.executemany("insert into Usuario(NomeUsuario, Email, Senha) values(?, ?, ?)", user)
conexao.commit()
conexao.close()

