﻿using SGED.Services.Entities;
using SGED.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Authorization;
using SGED.Objects.DTO.Entities;
using SGED.Objects.Utilities;

namespace SGED.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	//[Authorize("ApiScope")]
	public class TipoDocumentoEtapaController : Controller
	{

		private readonly ITipoDocumentoEtapaService _TipoDocumentoEtapaService;
		private Response _response;

		public TipoDocumentoEtapaController(ITipoDocumentoEtapaService TipoDocumentoEtapaService)
		{
			_TipoDocumentoEtapaService = TipoDocumentoEtapaService;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<TipoDocumentoDTO>>> Get()
		{
			var tipoDocumentosEtapas = await _TipoDocumentoEtapaService.GetAll();
			_response.Status = true; _response.Message = tipoDocumentosEtapas;
			return Ok(_response);
		}

		[HttpGet("{id}", Name = "GetTipoDocumentoEtapa")]
		public async Task<ActionResult<TipoDocumentoDTO>> Get(int id)
		{
			var tipoDocumentoEtapaDTO = await _TipoDocumentoEtapaService.GetById(id);
			if (tipoDocumentoEtapaDTO == null)
			{
				_response.Status = false; _response.Message = "Tipo Documento Etapa não encontrado!";
				return NotFound(_response);
			};

			_response.Status = true; _response.Message = tipoDocumentoEtapaDTO;
			return Ok(_response);
		}

		[HttpPost]
		public async Task<ActionResult> Post([FromBody] TipoDocumentoEtapaDTO TipoDocumentoEtapaDTO)
		{
			if (TipoDocumentoEtapaDTO is null) return BadRequest("Dado inválido!");
			await _TipoDocumentoEtapaService.Create(TipoDocumentoEtapaDTO);
			return new CreatedAtRouteResult("GetTipoDocumentoEtapa", new { id = TipoDocumentoEtapaDTO.Id }, TipoDocumentoEtapaDTO);
		}

		[HttpPut()]
		public async Task<ActionResult> Put([FromBody] TipoDocumentoEtapaDTO TipoDocumentoEtapaDTO)
		{
			if (TipoDocumentoEtapaDTO is null) return BadRequest("Dado invalido!");
			await _TipoDocumentoEtapaService.Update(TipoDocumentoEtapaDTO);
			return Ok(TipoDocumentoEtapaDTO);
		}

		[HttpDelete("{id}")]
		public async Task<ActionResult<TipoDocumentoEtapaDTO>> Delete(int id)
		{
			var TipoDocumentoEtapaDTO = await _TipoDocumentoEtapaService.GetById(id);
			if (TipoDocumentoEtapaDTO == null) return NotFound("TipoDocumentoEtapa não econtrado!");
			await _TipoDocumentoEtapaService.Remove(id);
			return Ok(TipoDocumentoEtapaDTO);
		}

		[HttpGet("Related/{IdEtapa}")]
		public async Task<ActionResult<TipoDocumentoDTO>> GetTypeDocumentsRelatedToStage(int IdEtapa)
		{
			if (IdEtapa <= 0) return BadRequest("Dado inválido!");
			var tipoDocumentosRelacionados = await _TipoDocumentoEtapaService.GetTypeDocumentsRelatedToStage(IdEtapa);
			return Ok(tipoDocumentosRelacionados);
		}

		[HttpGet("NoRelated/{IdEtapa}")]
		public async Task<ActionResult<TipoDocumentoDTO>> GetTypeDocumentsNoRelatedToStage(int IdEtapa)
		{
			if (IdEtapa <= 0) return BadRequest("Dado inválido!");
			var tipoDocumentosNaoRelacionados = await _TipoDocumentoEtapaService.GetTypeDocumentsNoRelatedToStage(IdEtapa);
			return Ok(tipoDocumentosNaoRelacionados);
		}
	}
}