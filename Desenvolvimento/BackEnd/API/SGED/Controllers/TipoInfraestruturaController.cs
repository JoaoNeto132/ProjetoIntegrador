﻿using SGED.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Authorization;
using SGED.Objects.DTO.Entities;
using SGED.Objects.Utilities;

namespace SGED.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TipoInfraestruturaController : Controller
    {
        private readonly ITipoInfraestruturaService _tipoInfraestruturaService;
        private readonly Response _response;

        public TipoInfraestruturaController(ITipoInfraestruturaService tipoInfraestruturaService)
        {
            _tipoInfraestruturaService = tipoInfraestruturaService;

            _response = new Response();
        }

        [HttpGet()]
        public async Task<ActionResult<IEnumerable<TipoInfraestruturaDTO>>> Get()
        {
            try
            {
                var tipoInfraestruturasDTO = await _tipoInfraestruturaService.GetAll();
                _response.SetSuccess(); _response.Data = tipoInfraestruturasDTO;
                _response.Message = tipoInfraestruturasDTO.Any() ?
                    "Lista do(s) Tipo(s) de Infraestrutura obtida com sucesso." :
                    "Nenhum Tipo de Infraestrutura encontrado.";
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível adquirir a lista do(s) Tipo(s) de Infraestrutura!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpGet("{id}", Name = "GetTipoInfraestrutura")]
        public async Task<ActionResult<TipoInfraestruturaDTO>> Get(int id)
        {
            try
            {
                var tipoInfraestruturaDTO = await _tipoInfraestruturaService.GetById(id);
                if (tipoInfraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "Tipo de Infraestrutura não encontrado!"; _response.Data = tipoInfraestruturaDTO;
                    return NotFound(_response);
                };

                _response.SetSuccess(); _response.Message = "Tipo de Infraestrutura " + tipoInfraestruturaDTO.NomeTipoInfraestrutura + " obtido com sucesso."; _response.Data = tipoInfraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível adquirir o Tipo de Infraestrutura informado!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpPost()]
        public async Task<ActionResult> Post([FromBody] TipoInfraestruturaDTO tipoInfraestruturaDTO)
        {
            if (tipoInfraestruturaDTO is null)
            {
                _response.SetInvalid(); _response.Message = "Dado(s) inválido(s)!"; _response.Data = tipoInfraestruturaDTO;
                return BadRequest(_response);
            }

            try
            {
                if (!await TipoInfraestruturaExists(tipoInfraestruturaDTO))
                {
                    _response.SetConflict(); _response.Message = "Já existe o Tipo de Infraestrutura " + tipoInfraestruturaDTO.NomeTipoInfraestrutura + "!"; _response.Data = tipoInfraestruturaDTO;
                    return BadRequest(_response);
                }

                await _tipoInfraestruturaService.Create(tipoInfraestruturaDTO);

                _response.SetSuccess(); _response.Message = "Tipo de Infraestrutura " + tipoInfraestruturaDTO.NomeTipoInfraestrutura + " cadastrado com sucesso."; _response.Data = tipoInfraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível cadastrar o Tipo de Infraestrutura!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpPut()]
        public async Task<ActionResult> Put([FromBody] TipoInfraestruturaDTO tipoInfraestruturaDTO)
        {
            if (tipoInfraestruturaDTO is null)
            {
                _response.SetInvalid(); _response.Message = "Dado(s) inválido(s)!"; _response.Data = tipoInfraestruturaDTO;
                return BadRequest(_response);
            }

            try
            {
                var existingTipoInfraestruturaDTO = await _tipoInfraestruturaService.GetById(tipoInfraestruturaDTO.Id);
                if (existingTipoInfraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "O Tipo de Infraestrutura informado não existe!"; _response.Data = tipoInfraestruturaDTO;
                    return NotFound(_response);
                }

                if (!await TipoInfraestruturaExists(tipoInfraestruturaDTO))
                {
                    _response.SetConflict(); _response.Message = "Já existe o Tipo de Infraestrutura " + tipoInfraestruturaDTO.NomeTipoInfraestrutura + "!"; _response.Data = tipoInfraestruturaDTO;
                    return BadRequest(_response);
                }

                await _tipoInfraestruturaService.Update(tipoInfraestruturaDTO);

                _response.SetSuccess(); _response.Message = "Tipo de Infraestrutura " + tipoInfraestruturaDTO.NomeTipoInfraestrutura + " alterado com sucesso."; _response.Data = tipoInfraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível alterar o Tipo de Infraestrutura!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<TipoInfraestruturaDTO>> Delete(int id)
        {
            try
            {
                var tipoInfraestruturaDTO = await _tipoInfraestruturaService.GetById(id);
                if (tipoInfraestruturaDTO is null)
                {
                    _response.SetNotFound(); _response.Message = "Tipo de Infraestrutura não encontrado!"; _response.Data = tipoInfraestruturaDTO;
                    return NotFound(_response);
                }

                await _tipoInfraestruturaService.Remove(id);

                _response.SetSuccess(); _response.Message = "Tipo de Infraestrutura " + tipoInfraestruturaDTO.NomeTipoInfraestrutura + " excluído com sucesso."; _response.Data = tipoInfraestruturaDTO;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.SetError(); _response.Message = "Não foi possível excluir o Tipo de Infraestrutura!"; _response.Data = new { ErrorMessage = ex.Message, StackTrace = ex.StackTrace ?? "No stack trace available!" };
                return StatusCode(StatusCodes.Status500InternalServerError, _response);
            }
        }

        private async Task<bool> TipoInfraestruturaExists(TipoInfraestruturaDTO tipoInfraestruturaDTO)
        {
            var tipoInfraestruturasDTO = await _tipoInfraestruturaService.GetAll();
            return tipoInfraestruturasDTO.FirstOrDefault(b => Operator.CompareString(b.NomeTipoInfraestrutura, tipoInfraestruturaDTO.NomeTipoInfraestrutura)) is not null;
        }
    }
}