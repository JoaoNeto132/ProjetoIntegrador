﻿using System.ComponentModel.DataAnnotations;

namespace SGED.DTO.Entities
{
	public class TipoUsuarioDTO
	{
		public int Id { get; set; }

		[Required(ErrorMessage = "O nível de acesso é requerido!")]
		[MinLength(1)]
		[MaxLength(1)]
		public string? NivelAcesso { get; set; }

		[Required(ErrorMessage = "O campo nome do tipo usuário é requerido!")]
		[MinLength(3)]
		[MaxLength(20)]
		public string? NomeTipoUsuario { get; set; }

		[Required(ErrorMessage = "O campo descrição é requerido!")]
		[MinLength (5)]
		[MaxLength(300)]
		public string? DescricaoTipoUsuario { get; set; }
	}
}
