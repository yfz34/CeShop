using System;
using System.Collections.Generic;
using System.Linq;

namespace CeShop.Domain.Dtos.Generics
{
    public class Result
    {
        public bool Success => Errors == null || !Errors.Any();
        public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
    }

    public class Result<T>
    {
        public T Data { get; set; }
        public bool Success => Errors == null || !Errors.Any();
        public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
    }
}