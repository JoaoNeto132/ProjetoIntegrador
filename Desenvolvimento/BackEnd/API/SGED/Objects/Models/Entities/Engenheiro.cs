﻿using System.ComponentModel.DataAnnotations.Schema;
using SGED.Objects.Interfaces.Pessoa;
using SGED.DTO.Entities;

namespace SGED.Objects.Models.Entities
{
    [Table("engenheiro")]
    public class Engenheiro : IPessoa, IEngenheiro
    {
        [Column("idengenheiro")]
        public int Id { get; set; }

        [Column("imagempessoa")]
        public string ImagemPessoa { get; set; }

        [Column("nomepessoa")]
        public string NomePessoa { get; set; }

        [Column("emailpessoa")]
        public string EmailPessoa { get; set; }

        [Column("telefonepessoa")]
        public string TelefonePessoa { get; set; }

        [Column("cpfcnpjpessoa")]
        public string CpfCnpjPessoa { get; set; }

        [Column("rgiepessoa")]
        public string RgIePessoa { get; set; }

        [Column("creaengenheiro")]
        public string CreaEngenheiro { get; set; }

        public ICollection<Instalacao>? Instalacoes { get; set; }
    }
}