﻿using System.ComponentModel.DataAnnotations.Schema;
using SGED.Objects.Interfaces;
using SGED.Objects.Utilities;

namespace SGED.Objects.Models.Entities
{
    [Table("tipodocumento")]
    public class TipoDocumento : IStatus
    {
        [Column("idTipoDocumento")]
        public int Id { get; set; }

        [Column("nomeTipoDocumento")]
        public string NomeTipoDocumento { get; set; }

        [Column("descricaoTipoDocumento")]
        public string DescricaoTipoDocumento { get; set; }

        [Column("statustipoprocesso")]
        public bool Status { get; set; }

        public ICollection<TipoDocumentoEtapa>? TipoDocumentoEtapas { get; set; }
    }
}
