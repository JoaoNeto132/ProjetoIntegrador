﻿using SGED.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SGED.DTO.Entities
{
    public class CidadeDTO
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O nome do Cidade é requerido!")]
        [MinLength(3)]
        [MaxLength(100)]
        public string? NomeCidade { get; set; }


        [JsonIgnore]
        public EstadoDTO? EstadoDTO { get; set; }

        public int EstadoId { get; set; }

    }
}
